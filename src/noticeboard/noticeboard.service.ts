import {
    BadRequestException,
    Inject,
    Injectable,
} from "@nestjs/common";

import { Op } from "sequelize";
import sanitizeHtml from "sanitize-html";

import { NOTICEBOARD_DAO } from "src/constants";

import {
    NoticeboardModel,
    StudentModel,
    UserModel,
} from "src/db/models";

import { EmailService } from "src/services/EmailService";

import { CreateAnnouncementDto } from "./dtos/create.dtos";
import { QueryAnnouncementDto } from "./dtos/query.dtos";

@Injectable()
export class NoticeboardService {
    constructor(
        @Inject(NOTICEBOARD_DAO)
        private readonly noticeboardRepository: typeof NoticeboardModel,

        private readonly emailService: EmailService
    ) { }

    /**
     * Retrieve student email addresses.
     *
     * If programIds are provided, return only students
     * belonging to the selected academic programs.
     */
    private async getStudentEmails(
        programIds?: string[]
    ): Promise<string[]> {
        const students = await StudentModel.findAll({
            attributes: ["id"],

            ...(programIds?.length
                ? {
                    where: {
                        programId: {
                            [Op.in]: programIds,
                        },
                    },
                }
                : {}),

            include: [
                {
                    model: UserModel,
                    as: "user",
                    attributes: ["email"],
                    required: true,
                },
            ],
        });

        return [
            ...new Set(
                students
                    .map((student) => student.user?.email)
                    .filter(
                        (email): email is string =>
                            typeof email === "string" &&
                            email.trim().length > 0
                    )
                    .map((email) => email.trim().toLowerCase())
            ),
        ];
    }

    /**
     * Convert a Base64 image data URL into a Nodemailer
     * inline attachment.
     *
     * The HTML email references it using:
     * cid:announcement-logo
     */
    private getLogoAttachment(logo?: string) {
        if (!logo) {
            return undefined;
        }

        const match = logo.match(
            /^data:image\/(png|jpeg|gif|webp);base64,([A-Za-z0-9+/=\s]+)$/i
        );

        if (!match) {
            return undefined;
        }

        const imageType = match[1].toLowerCase();

        const extension =
            imageType === "jpeg" ? "jpg" : imageType;

        const base64Content = match[2].replace(/\s/g, "");

        return {
            filename: `announcement-logo.${extension}`,

            content: Buffer.from(
                base64Content,
                "base64"
            ),

            contentType: `image/${imageType}`,

            cid: "announcement-logo",

            contentDisposition: "inline" as const,
        };
    }

    /**
     * Build the announcement email HTML.
     *
     * The logo uses a Content-ID reference instead of
     * embedding a Base64 data URL directly in the HTML.
     */
    private buildAnnouncementHtml(
        dto: CreateAnnouncementDto,
        includeLogo: boolean
    ): string {
        const safeHeading = sanitizeHtml(
            dto.heading,
            {
                allowedTags: [],
                allowedAttributes: {},
            }
        );

        const safeClubName = sanitizeHtml(
            dto.clubname,
            {
                allowedTags: [],
                allowedAttributes: {},
            }
        );

        const safeInfo = sanitizeHtml(
            dto.info,
            {
                allowedTags: [
                    "p",
                    "br",
                    "strong",
                    "b",
                    "em",
                    "i",
                    "u",
                    "s",
                    "ul",
                    "ol",
                    "li",
                    "a",
                    "h1",
                    "h2",
                    "h3",
                    "blockquote",
                ],

                allowedAttributes: {
                    a: [
                        "href",
                        "target",
                        "rel",
                    ],
                },

                allowedSchemes: [
                    "http",
                    "https",
                    "mailto",
                ],
            }
        );

        let html = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
                <h2>${safeHeading}</h2>

                <div>
                    ${safeInfo.replace(/\n/g, "<br>")}
                </div>

                <hr />

                <p>
                    <strong>${safeClubName}</strong>
                </p>
        `;

        if (includeLogo) {
            html += `
                <div style="margin-top: 16px;">
                    <img
                        src="cid:announcement-logo"
                        alt="Announcement logo"
                        style="max-width: 200px; height: auto; display: block;"
                    />
                </div>
            `;
        }

        html += "</div>";

        return html;
    }

    /**
     * Create an announcement and send it to the selected recipients.
     */
    async createAnnouncement(
        createAnnouncementDto: CreateAnnouncementDto
    ) {
        const group = (
            createAnnouncementDto.group || "all"
        )
            .trim()
            .toLowerCase();

        const programIds = [
            ...new Set(
                (createAnnouncementDto.programIds || [])
                    .map((id) => id.trim())
            ),
        ];

        const supportedGroups = [
            "all",
            "none",
            "manager",
            "programs",

            // Backward compatibility with older frontend values.
            "all@iiti.ac.in",
            "managerplacement@iiti.ac.in",
        ];

        if (!supportedGroups.includes(group)) {
            throw new BadRequestException(
                "Invalid recipient group selected."
            );
        }

        if (
            group === "programs" &&
            programIds.length === 0
        ) {
            throw new BadRequestException(
                "Please select at least one academic program."
            );
        }

        /*
         * Resolve the predefined recipients.
         */
        let groupEmails: string[] = [];

        switch (group) {
            case "all":
            case "all@iiti.ac.in": {
                // Retrieve every student with an associated user email.
                groupEmails = await this.getStudentEmails();
                break;
            }

            case "none": {
                // No predefined recipients.
                // Only manually entered addresses will be used.
                groupEmails = [];
                break;
            }

            case "manager":
            case "managerplacement@iiti.ac.in": {
                // The manager email is hardcoded, not stored in .env.
                groupEmails = [
                    "managerplacement@iiti.ac.in",
                ];

                break;
            }

            case "programs": {
                // Retrieve students in the selected academic programs.
                groupEmails =
                    await this.getStudentEmails(programIds);

                break;
            }
        }

        /*
         * Validate the manually entered email addresses.
         */
        const manualEmails =
            createAnnouncementDto.emails || [];

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const invalidEmails = manualEmails.filter(
            (email) =>
                typeof email !== "string" ||
                !emailPattern.test(email.trim())
        );

        if (invalidEmails.length > 0) {
            throw new BadRequestException(
                "One or more manually entered email addresses are invalid."
            );
        }

        /*
         * Combine recipients, normalize addresses, and remove duplicates.
         *
         * Both institutional and external email addresses are allowed.
         */
        const finalEmails = [
            ...new Set(
                [
                    ...groupEmails,
                    ...manualEmails,
                ]
                    .map((email) => email.trim().toLowerCase())
                    .filter(Boolean)
            ),
        ];

        /*
         * Save the announcement in the database.
         */
        const savedAnnouncement =
            await this.noticeboardRepository.create({
                clubname: createAnnouncementDto.clubname,
                heading: createAnnouncementDto.heading,
                info: createAnnouncementDto.info,

                announcelogo:
                    createAnnouncementDto.announcelogo || "",

                group,
            });

        /*
         * Respect the existing email feature flag.
         */
        if (process.env.SEND_MAIL !== "true") {
            return {
                message:
                    "Announcement created successfully. Email sending is disabled.",
                data: savedAnnouncement,
            };
        }

        /*
         * No emails need to be sent if no recipients were selected.
         */
        if (finalEmails.length === 0) {
            return {
                message:
                    "Announcement created successfully, but no recipients were found.",
                data: savedAnnouncement,
                recipientCount: 0,
            };
        }

        /*
         * Send the email.
         */
        try {
            const logoAttachment = this.getLogoAttachment(
                createAnnouncementDto.announcelogo
            );

            const html = this.buildAnnouncementHtml(
                createAnnouncementDto,
                Boolean(logoAttachment)
            );

            await this.emailService.sendEmail({
                // Keep the existing property name required by EmailService.
                recepients: finalEmails.map(
                    (email) => ({
                        name: "",
                        address: email,
                    })
                ),

                subject:
                    createAnnouncementDto.heading,

                html,

                attachments: logoAttachment
                    ? [logoAttachment]
                    : [],
            });

            console.log(
                `Announcement email submitted to ${finalEmails.length} recipient(s).`
            );

            return {
                message:
                    "Announcement created successfully and email sent.",

                data: savedAnnouncement,

                recipientCount: finalEmails.length,
            };
        } catch (error) {
            console.error(
                "Failed to send announcement email:",
                error
            );

            return {
                message:
                    "Announcement created, but sending the email failed. Check the backend logs.",

                data: savedAnnouncement,

                recipientCount: 0,
            };
        }
    }

    /**
     * Delete one or more announcements by their numeric IDs.
     */
    async deleteAnnouncements(
        ids: Array<string | number> | string | number
    ) {
        const inputIds = Array.isArray(ids)
            ? ids
            : [ids];

        const normalizedIds = inputIds.map((id) =>
            String(id).trim()
        );

        if (
            normalizedIds.length === 0 ||
            normalizedIds.some(
                (id) =>
                    !/^\d+$/.test(id) ||
                    Number(id) <= 0
            )
        ) {
            throw new BadRequestException(
                "Please provide valid announcement IDs."
            );
        }

        const uniqueIds = [
            ...new Set(
                normalizedIds.map(Number)
            ),
        ];

        const deletedCount =
            await this.noticeboardRepository.destroy({
                where: {
                    id: {
                        [Op.in]: uniqueIds,
                    },
                } as any,
            });

        return {
            message:
                deletedCount > 0
                    ? "Announcement(s) deleted successfully."
                    : "No matching announcements were found.",

            deletedCount,
        };
    }

    /**
     * Retrieve announcements with pagination.
     */
    async getAnnouncements(
        queryDto?: QueryAnnouncementDto
    ) {
        const page = queryDto?.page || 1;
        const limit = queryDto?.limit || 50;

        const { rows, count } =
            await this.noticeboardRepository.findAndCountAll({
                order: [
                    ["createdAt", "DESC"],
                ],

                offset: (page - 1) * limit,

                limit,
            });

        return {
            data: rows.map((item) =>
                item.get({ plain: true })
            ),

            total: count,

            page,

            limit,
        };
    }
}
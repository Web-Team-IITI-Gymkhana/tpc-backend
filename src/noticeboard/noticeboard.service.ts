import { Inject, Injectable } from "@nestjs/common";
import { EmailService } from "src/services/EmailService";
import { NOTICEBOARD_DAO } from "src/constants";
import { NoticeboardModel } from "src/db/models";

import { CreateAnnouncementDto } from "./dtos/create.dtos";
import { QueryAnnouncementDto } from "./dtos/query.dtos";

@Injectable()
export class NoticeboardService {
    constructor(
        @Inject(NOTICEBOARD_DAO)
        private readonly noticeboardRepository: typeof NoticeboardModel,
        private readonly emailService: EmailService
    ) { }

    async createAnnouncement(
        createAnnouncementDto: CreateAnnouncementDto
    ) {
        const savedAnnouncement =
            await this.noticeboardRepository.create({
                clubname: createAnnouncementDto.clubname,
                heading: createAnnouncementDto.heading,
                info: createAnnouncementDto.info,
                announcelogo:
                    createAnnouncementDto.announcelogo || "",
                group:
                    createAnnouncementDto.group || "all",
            });

        try {
            if (process.env.SEND_MAIL !== "true") {
                return {
                    message:
                        "Announcement created successfully. Email sending is disabled.",
                    data: savedAnnouncement,
                };
            }

            const predefinedGroups: Record<
                string,
                string[]
            > = {
                none: [
                    process.env.DEFAULT_MAIL_TO || "",
                ],
                all: [],
                cse: [],
                ece: [],
            };

            let finalEmails: string[] = [];

            // Add recipients from selected group
            if (createAnnouncementDto.group) {
                if (
                    predefinedGroups[
                    createAnnouncementDto.group
                    ]
                ) {
                    finalEmails = [
                        ...predefinedGroups[
                        createAnnouncementDto.group
                        ],
                    ];
                } else if (
                    createAnnouncementDto.group.includes(
                        "@"
                    )
                ) {
                    finalEmails = [
                        createAnnouncementDto.group,
                    ];
                }
            }

            // Add manually entered emails
            if (
                createAnnouncementDto.emails &&
                createAnnouncementDto.emails.length > 0
            ) {
                finalEmails = [
                    ...finalEmails,
                    ...createAnnouncementDto.emails,
                ];
            }

            // Keep only @iiti.ac.in emails
            finalEmails = finalEmails.filter(
                (email) =>
                    email &&
                    email
                        .trim()
                        .toLowerCase()
                        .endsWith("@iiti.ac.in")
            );

            // Remove duplicates
            finalEmails = [
                ...new Set(
                    finalEmails.map((email) =>
                        email.trim().toLowerCase()
                    )
                ),
            ];

            console.log(
                "Recipients:",
                finalEmails
            );

            if (finalEmails.length === 0) {
                return {
                    message:
                        "Announcement created successfully, but no valid recipients were found.",
                    data: savedAnnouncement,
                };
            }

            let html = `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2>${createAnnouncementDto.heading}</h2>
                    <p>${createAnnouncementDto.info.replace(
                /\n/g,
                "<br>"
            )}</p>
                    <hr>
                    <p><strong>${createAnnouncementDto.clubname}</strong></p>
                </div>
            `;

            // Add image if provided
            if (
                createAnnouncementDto.announcelogo &&
                createAnnouncementDto.announcelogo.includes(
                    "base64,"
                )
            ) {
                html += `
                    <p>
                        <img
                            src="${createAnnouncementDto.announcelogo}"
                            style="max-width: 200px; margin-top: 10px;"
                        />
                    </p>
                `;
            }

            await this.emailService.sendEmail({
                recepients: finalEmails.map(
                    (email) => ({
                        name: "",
                        address: email,
                    })
                ),
                subject:
                    createAnnouncementDto.heading,
                html,
            });

            console.log(
                "Announcement email sent successfully."
            );
        } catch (error) {
            console.error(
                "Failed to send announcement email:",
                error
            );
        }

        return {
            message:
                "Announcement created successfully.",
            data: savedAnnouncement,
        };
    }

    async getAnnouncements(
        queryDto?: QueryAnnouncementDto
    ) {
        const page = queryDto?.page || 1;
        const limit = queryDto?.limit || 50;

        const { rows, count } =
            await this.noticeboardRepository.findAndCountAll(
                {
                    order: [
                        ["createdAt", "DESC"],
                    ],
                    offset:
                        (page - 1) * limit,
                    limit,
                }
            );

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
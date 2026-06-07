# PPO Upload Guide

This file explains how to use the `upload-ppo-data` script in a simple, beginner-friendly way.

## Command

Usage:
  npx ts-node src/upload-ppo-data.ts <intern_season_id> <placement_season_id> <program_year> <path_to_csv>

Arguments:
  intern_season_id    - UUID of the internship season
  placement_season_id - UUID of the placement season
  program_year        - Program year of the students
  path_to_csv         - Path to the CSV file

Example:
  npx ts-node src/upload-ppo-data.ts abc-111 xyz-222 2026 ./resources/ppo-data.csv

## What This Script Does

This script reads a PPO CSV file and syncs the data into the backend.

In simple terms, it:

1. Reads each student row from the CSV file.
2. Finds the student using the roll number.
3. Creates the student if needed.
4. Finds or creates the company, recruiter, job, and salary.
5. Creates the placement offer for that student.
6. Tries to connect the PPO with the student's internship data if it already exists.

## CSV Format

The sample format is shown in [resources/ppo-sample-data.csv](/home/pranay-gottimukula/Programs/TPC/tpc-projects/tpc-backend/resources/ppo-sample-data.csv).

Current expected column order:

`S NO, Name, Official Email, Department, Gender, Date of Birth, Personal Email, Birth Category, Contact No., Internship Company, Stipend p/m, Others (for accomodation etc), PPO- CTC, Offer rcd date, FTE-Company Name Final offer (including PPO), Job Title, 1st year CTC, Overall CTC`

## Neccessary Columns

```bash
const REQUIRED_PPO_COLUMNS: { column: number; header: string; field: keyof IPPORow }[] = [
  { column: 2, header: "Name", field: "name" },
  { column: 3, header: "Official Email", field: "officialEmail" },
  { column: 4, header: "Department", field: "department" },
  { column: 5, header: "Gender", field: "gender" },
  { column: 10, header: "Internship Company", field: "internshipCompany" },
  { column: 15, header: "FTE-Company Name Final offer", field: "finalCompany" },
];
```

## Important Field Rules

### Department

The `Department` field in [resources/ppo-sample-data.csv] should be one of the department values from [src/enums/department.enum.ts]

- `ASTRONOMY_ASTROPHYSICS_AND_SPACE_ENGINEERING`
- `BIOSCIENCES_AND_BIOMEDICAL_ENGINEERING`
- `CHEMISTRY`
- `CIVIL_ENGINEERING`
- `COMPUTER_SCIENCE_AND_ENGINEERING`
- `ELECTRICAL_ENGINEERING`
- `HUMANITIES_AND_SOCIAL_SCIENCES`
- `MATHEMATICS`
- `MECHANICAL_ENGINEERING`
- `METALLURGICAL_ENGINEERING_AND_MATERIALS_SCIENCE`
- `PHYSICS`
- `CHEMICAL_ENGINEERING`
- `CEVITS`

Using one of the enum values directly is the safest option.

### Birth Category

The `Birth Category` field should be one of the values supported by the importer. Any Case is fine
If none is mentioned then it defaults to GENERAL category

Accepted values are:

- `gen`
- `general`
- `obc`
- `obc_nc`
- `obc_ncl`
- `sc`
- `st`
- `ews`
- `gen_pwd`
- `general_pwd`
- `obc_pwd`
- `sc_pwd`
- `st_pwd`
- `ews_pwd`


## Assumptions Before Running

We assume the following things are already present in the system:

- The student's `Program` is already created.
- The internship season already exists.
- The placement season already exists.

The script uses the placement season year when trying to find the student's program.

## How Program Information Is Decided

The script assumes part of the student's program information can be inferred from the official email.

Examples:

- Emails starting with `msc...` are treated as `MSc`
- Emails starting with `ms...` are treated as `MS(Research)`
- Emails starting with `mt...` are treated as `MTech`
- Emails starting with `phd...` are treated as `PhD`
- If none of the above match, the student is treated as `BTech`

Then the script combines:

- The inferred course from the email
- The department from the CSV
- The placement season year

to find the correct `Program`.

## Internship Data Recommendation

It is recommended that the student's data is already present in on-campus internship offers for the internship season.

That is the cleanest setup, because the script can connect the PPO flow with existing internship data.

But it would still work even if the internship offer is not already present.

## Company Name Consistency

Please keep company names consistent in the CSV.

The value in `Internship Company` and the value in `FTE-Company Name Final offer (including PPO)` should be written carefully and consistently for the same company.

There should not be spelling differences, typos, or alternate naming styles for the same company.

Examples of bad data:

- `Google`
- `Gooogle`
- `Google India`

If the same company is written in different ways, the system may create redundant company, job, or salary entries.

## Beginner Step-By-Step

1. Make sure both seasons already exist in the database.
2. Make sure the student's program already exists in the database.
3. Prepare the CSV using the same column order as the sample file.
4. Double-check `Department`, `Birth Category`, company names, and roll numbers.
5. Run the command:

```bash
npx ts-node src/upload-ppo-data.ts <intern_season_id> <placement_season_id> <program_year> <path_to_csv>
```

6. Example:

```bash
npx ts-node src/upload-ppo-data.ts abc-111 xyz-222 2026 ./resources/ppo-data.csv
```

## Practical Notes

- `Official Email` should be correct and important because course and roll no inference depends on it.
- `Department` should match the enum naming as closely as possible.
- `Overall CTC` and `1st year CTC` are expected as numbers in lakhs.

## Related Files

- Script entry: [src/upload-ppo-data.ts](/home/pranay-gottimukula/Programs/TPC/tpc-projects/tpc-backend/src/upload-ppo-data.ts)
- Main sync logic: [src/services/PPOSyncService.ts](/home/pranay-gottimukula/Programs/TPC/tpc-projects/tpc-backend/src/services/PPOSyncService.ts)
- Sample CSV: [resources/ppo-sample-data.csv](/home/pranay-gottimukula/Programs/TPC/tpc-projects/tpc-backend/resources/ppo-sample-data.csv)


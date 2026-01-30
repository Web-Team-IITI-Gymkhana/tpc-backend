# PPO Import Flow Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         PPO CSV FILE                             │
│  S.No, Name, Email, Company, Role, CTC, Internship Details...   │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PPOUploadService                              │
│                   (PPOUploadService.ts)                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
    ┌────────┐     ┌──────────┐    ┌─────────┐
    │Student │     │ Company  │    │ Season  │
    │ Find/  │     │  Find/   │    │Validate │
    │ Create │     │  Create  │    │         │
    └────┬───┘     └─────┬────┘    └─────────┘
         │               │
         │               ▼
         │         ┌──────────┐
         │         │Recruiter │
         │         │ Create   │
         │         └─────┬────┘
         │               │
         │               ▼
         │           ┌──────┐
         │           │ Job  │
         │           │Create│
         │           └───┬──┘
         │               │
         │               ▼
         │          ┌────────┐
         │          │ Salary │
         │          │ Create │
         │          └────┬───┘
         │               │
         └───────────────┘
                 │
                 ▼
         ┌──────────────┐
         │OnCampusOffer │ ← THIS IS KEY FOR DASHBOARD!
         │   Create     │
         └──────┬───────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Analytics Dashboard                            │
│                Shows: Offers, Packages, Statistics               │
└─────────────────────────────────────────────────────────────────┘
```

## Data Model Created

For each PPO entry, the following database records are created:

```
┌──────────────────────────────────────────────────────────────┐
│                         DATABASE                              │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────┐                                                │
│  │  User    │                                                │
│  │  Table   │                                                │
│  │ ┌──────┐ │                                                │
│  │ │ name │ │  Created for Student (if new)                │
│  │ │ email│ │  & Recruiter (system-generated)              │
│  │ │ role │ │                                                │
│  │ └──────┘ │                                                │
│  └─────┬────┘                                                │
│        │                                                      │
│        ▼                                                      │
│  ┌──────────┐                                                │
│  │ Student  │                                                │
│  │  Table   │                                                │
│  │ ┌──────┐ │                                                │
│  │ │rollNo│ │  Links to User                                │
│  │ │ cpi  │ │  Contains academic info                       │
│  │ │gender│ │                                                │
│  │ └──────┘ │                                                │
│  └─────┬────┘                                                │
│        │                                                      │
│        │                                                      │
│  ┌─────▼────┐      ┌──────────┐                             │
│  │ Company  │◄─────┤Recruiter │                             │
│  │  Table   │      │  Table   │                             │
│  │ ┌──────┐ │      │ ┌──────┐ │                             │
│  │ │ name │ │      │ │userId│ │  System-generated           │
│  │ │ categ│ │      │ │compId│ │  for PPO company            │
│  │ └──────┘ │      │ └──────┘ │                             │
│  └─────┬────┘      └────┬─────┘                             │
│        │                │                                     │
│        │                │                                     │
│        └────────┬───────┘                                     │
│                 ▼                                             │
│           ┌──────────┐      ┌──────────┐                     │
│           │   Job    │◄─────┤  Season  │                     │
│           │  Table   │      │  Table   │                     │
│           │ ┌──────┐ │      │ ┌──────┐ │                     │
│           │ │ role │ │      │ │ year │ │  Must exist         │
│           │ │status│ │      │ │ type │ │  before import      │
│           │ └──────┘ │      │ └──────┘ │                     │
│           └────┬─────┘      └──────────┘                     │
│                │                                              │
│                ▼                                              │
│          ┌──────────┐                                         │
│          │  Salary  │                                         │
│          │  Table   │                                         │
│          │ ┌──────┐ │                                         │
│          │ │ CTC  │ │  PPO salary details                    │
│          │ │base  │ │  Converted to rupees                   │
│          │ └──────┘ │                                         │
│          └────┬─────┘                                         │
│               │                                               │
│               │                                               │
│   ┌───────────┴──────────┐                                   │
│   │                      │                                   │
│   ▼                      ▼                                   │
│ ┌──────────┐      ┌────────────┐                            │
│ │ Student  │      │   Salary   │                            │
│ │   (id)   │      │    (id)    │                            │
│ └────┬─────┘      └─────┬──────┘                            │
│      │                  │                                    │
│      └──────────┬───────┘                                    │
│                 ▼                                            │
│         ┌──────────────┐                                     │
│         │OnCampusOffer │ ★ DASHBOARD DATA SOURCE ★          │
│         │    Table     │                                     │
│         │ ┌──────────┐ │                                     │
│         │ │studentId │ │  Visible in analytics              │
│         │ │salaryId  │ │  dashboard!                         │
│         │ │status    │ │                                     │
│         │ │metadata  │ │  Contains PPO internship info      │
│         │ └──────────┘ │                                     │
│         └──────────────┘                                     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Import Process Flow

```
START
  │
  ├─► Read CSV File
  │     │
  │     ├─► Parse headers
  │     ├─► Map columns
  │     └─► Extract rows
  │
  ├─► Validate Season
  │     │
  │     └─► Check season exists in DB
  │
  ├─► FOR EACH ROW:
  │     │
  │     ├─► Find/Create Student
  │     │     │
  │     │     ├─► Try by roll number
  │     │     ├─► Try by email
  │     │     └─► Create if not found
  │     │
  │     ├─► Find/Create Company
  │     │     │
  │     │     └─► Use final company name
  │     │
  │     ├─► Create Recruiter
  │     │     │
  │     │     ├─► Generate system email
  │     │     └─► Link to company
  │     │
  │     ├─► Create Job
  │     │     │
  │     │     ├─► Use PPO role
  │     │     ├─► Set status: COMPLETED
  │     │     └─► Set registration: CLOSED
  │     │
  │     ├─► Create Salary
  │     │     │
  │     │     ├─► Convert lakhs → rupees
  │     │     └─► Store CTC details
  │     │
  │     └─► Create OnCampusOffer
  │           │
  │           ├─► Link student + salary
  │           ├─► Set status: ACCEPTED
  │           └─► Store metadata:
  │                 - Internship company
  │                 - Stipend
  │                 - PPO date
  │                 - Source: PPO_IMPORT
  │
  └─► Report Summary
        │
        ├─► Success count
        ├─► Error count
        └─► Details logged
  
END
```

## Dashboard Data Query Flow

```
Dashboard Page
     │
     ▼
GET /api/v1/analytics-dashboard/statsOverall/{seasonId}
     │
     ▼
AnalyticsDashboardService.getStatsOverall()
     │
     ├─► Query OnCampusOfferModel
     │     │
     │     ├─► Include Salary
     │     ├─► Include Job
     │     ├─► Include Company
     │     └─► Include Season (filter by seasonId)
     │
     ├─► Calculate Statistics:
     │     │
     │     ├─► Total offers count
     │     ├─► Unique students (placed)
     │     ├─► Unique companies
     │     ├─► Package stats:
     │     │     ├─► Highest CTC
     │     │     ├─► Lowest CTC
     │     │     ├─► Mean CTC
     │     │     ├─► Median CTC
     │     │     └─► Mode CTC
     │     │
     │     └─► Placement percentage
     │
     └─► Return JSON Response
           │
           ▼
      Display in UI
```

## Why OnCampusOffer?

```
┌────────────────────────────────────────────────────────────┐
│                     COMPARISON                              │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  OffCampusOffer                   OnCampusOffer            │
│  ───────────────                  ───────────────          │
│                                                             │
│  • Simpler structure              • Full structure         │
│  • Direct student→company         • Student→Salary→Job     │
│  • No job tracking                • Complete job details   │
│  • ❌ NOT in dashboard             • ✅ IN DASHBOARD         │
│                                                             │
│  Use for:                         Use for:                 │
│  - External offers                - Campus placements      │
│  - Quick imports                  - PPO conversions ★      │
│  - Manual entries                 - Dashboard reporting    │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

## Metadata Structure

Each OnCampusOffer stores rich metadata about the PPO:

```json
{
  "ppoFromCompany": "Quadeye",
  "ppoOfferDate": "7/16/2025",
  "internStipend": 500000,
  "internOthers": 500000,
  "source": "PPO_IMPORT",
  "importDate": "2026-01-08T10:30:00.000Z"
}
```

This allows you to:
- ✅ Track which internships led to PPOs
- ✅ Audit when data was imported
- ✅ Distinguish PPOs from regular placements
- ✅ Generate PPO conversion reports

## Command Flow

```
Terminal
   │
   ├─► npm run upload:ppo file.csv seasonId
   │      │
   │      └─► ts-node src/upload-ppo-data.ts
   │             │
   │             ├─► Parse arguments
   │             ├─► Create NestJS context
   │             ├─► Get PPOUploadService
   │             ├─► Call uploadPPOFromExcel()
   │             └─► Close context
   │
   └─► Console output with progress
```

## Files & Responsibilities

```
┌─────────────────────────────────────────────────────────┐
│                    File Structure                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  PPOUploadService.ts                                    │
│  ├─► Core business logic                                │
│  ├─► CSV parsing                                        │
│  ├─► Database operations                                │
│  └─► Validation & error handling                        │
│                                                          │
│  upload-ppo-data.ts                                     │
│  ├─► CLI interface                                      │
│  ├─► Argument parsing                                   │
│  └─► User-friendly messages                             │
│                                                          │
│  DataCliModule.ts                                       │
│  ├─► Dependency injection                               │
│  ├─► Database connection                                │
│  └─► Service registration                               │
│                                                          │
│  ppo-sample-data.csv                                    │
│  └─► Template & example data                            │
│                                                          │
│  PPO_IMPORT_*.md                                        │
│  └─► Documentation                                      │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Success Criteria

✅ CSV parsed correctly
✅ All required entities created
✅ OnCampusOffer records inserted
✅ Data appears in dashboard API
✅ Dashboard UI shows updated stats
✅ Package statistics include PPO CTCs
✅ Company count includes PPO companies
✅ Placement percentage updated

---

**Ready to import? Run:** `npm run upload:ppo ./resources/ppo-sample-data.csv <YOUR_SEASON_ID>`

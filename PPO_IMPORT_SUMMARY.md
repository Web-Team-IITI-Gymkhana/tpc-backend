# PPO Data Import - Executive Summary

## What Was Done

I've explored your TPC codebase and created a complete solution to import PPO (Pre-Placement Offer) data as offers that **will appear in the analytics dashboard**.

## Key Findings

### ✅ Dashboard Visibility Requirement
- The analytics dashboard (`/src/analytics-dashboard/`) **only displays OnCampusOffers**
- OffCampusOffers are NOT shown in current dashboard implementation
- To see PPO data in dashboard, we MUST create OnCampusOffers

### 🔗 Data Model Relationships
```
OnCampusOffer → Salary → Job → Company
     ↓
  Student

OffCampusOffer → Company
     ↓           ↓
  Student    Season
```

## Solution Delivered

### 📁 Files Created

1. **`PPO_IMPORT_GUIDE.md`** - Comprehensive technical guide
   - Explains architecture and approach
   - Detailed implementation code
   - Alternative approaches
   - Future enhancements

2. **`PPO_IMPORT_QUICKSTART.md`** - User-friendly quick start guide
   - Step-by-step instructions
   - Troubleshooting tips
   - Examples and validation

3. **`src/services/PPOUploadService.ts`** - Core implementation
   - Reads Excel/CSV files
   - Creates Company, Recruiter, Job, Salary records
   - Creates OnCampusOffers (dashboard-visible)
   - Handles student creation/lookup
   - Stores PPO metadata

4. **`src/upload-ppo-data.ts`** - CLI script
   - User-friendly command-line interface
   - Error handling and validation
   - Progress reporting

5. **`resources/ppo-sample-data.csv`** - Sample data file
   - Template for import
   - Based on your provided data

6. **`src/services/DataCliModule.ts`** - Updated module
   - Added PPOUploadService provider
   - Configured dependencies

7. **`package.json`** - Added script
   - `npm run upload:ppo` command

## How to Use

### Quick Command

```bash
# Import PPO data
npm run upload:ppo ./resources/ppo-data.csv <SEASON_ID>

# With student creation
npm run upload:ppo ./resources/ppo-data.csv <SEASON_ID> "3" "BTECH"
```

### What It Does

For each PPO record, the script:
1. ✅ Finds or creates the student
2. ✅ Finds or creates the company
3. ✅ Creates a recruiter (system-generated)
4. ✅ Creates a job posting for the role
5. ✅ Creates a salary record with CTC details
6. ✅ Creates an **OnCampusOffer** (visible in dashboard!)
7. ✅ Stores PPO metadata (internship info, dates, etc.)

## CSV Format Required

Your current CSV is mostly compatible! Just ensure:

| Column | Example | Notes |
|--------|---------|-------|
| S NO | 1 | Serial number |
| Name | ATHARVA NANOTI | Student name |
| Official Email | cse220001013@iiti.ac.in | Unique identifier |
| Department | Computer Science & Engineering | Must match DB |
| Gender | M | M/F/Other |
| Birth Category | gen | gen/obc_nc/sc/st/ews |
| Contact No. | 7414924595 | 10 digits |
| Internship Company | Quadeye | PPO source |
| Stipend p/m | 500000 | In rupees |
| Others | 500000 | Accommodation |
| PPO- CTC | 93 | In lakhs |
| Offer rcd date | 7/16/2025 | Date received |
| Final Company | Quadeye (PPO) | Accepted offer |
| Job Title | Quant Role | Role name |
| 1st year CTC | 103 | In lakhs |
| Overall CTC | 103 | In lakhs |

## Dashboard Verification

After import, check:

### API Endpoint
```bash
GET /api/v1/analytics-dashboard/statsOverall/{seasonId}
```

### Expected Response
```json
{
  "totalRegisteredStudentsCount": 150,
  "placedStudentsCount": 120,
  "placementPercentage": 80,
  "totalOffers": 135,
  "totalCompaniesOffering": 45,
  "highestPackage": 10300000,  // ← Should include your PPO CTCs
  "lowestPackage": 500000,
  "meanPackage": 5000000
}
```

### Dashboard UI
Navigate to: `/admin/dashboard` or `/tpc-member/dashboard`

You should see:
- ✅ Updated placement statistics
- ✅ PPO offers counted in total offers
- ✅ Package stats include PPO CTCs
- ✅ Company count includes PPO companies

## Important Notes

### ⚠️ Season ID Required
You need the UUID of your placement season. Get it from:
```sql
SELECT id, type, year FROM "Season" WHERE type = 'PLACEMENT';
```

### ⚠️ CTC Format
- Input CSV: Values in **Lakhs** (e.g., 103)
- Database: Values in **Rupees** (e.g., 10300000)
- Script automatically converts: `lakhs * 100000`

### ⚠️ Students
- If students exist: Script finds them by email/roll number
- If students don't exist: Provide year and course to create them

## Advantages of This Approach

1. ✅ **Dashboard Visibility**: Creates OnCampusOffers that appear in analytics
2. ✅ **Complete Data**: Maintains full job/salary/company relationships
3. ✅ **Metadata Preservation**: Stores PPO-specific info (internship company, dates)
4. ✅ **Referential Integrity**: Follows existing data model
5. ✅ **Scalable**: Can handle large CSV files
6. ✅ **Error Handling**: Continues on errors, reports at end
7. ✅ **Reusable**: Can run multiple times with different files

## Next Steps

### 1. Immediate Testing
```bash
# Get season ID
npm run upload:ppo ./resources/ppo-sample-data.csv <YOUR_SEASON_ID>

# Check dashboard
curl http://localhost:3000/api/v1/analytics-dashboard/statsOverall/<SEASON_ID>
```

### 2. Production Import
```bash
# Prepare your full PPO data file
npm run upload:ppo ./path/to/full-ppo-data.csv <SEASON_ID> "3" "BTECH"

# Verify in dashboard UI
```

### 3. Optional Enhancements
- Add roll number column to CSV
- Create web UI for upload
- Add bulk update capability
- Schedule automated imports

## Files Location

All new files are in `tpc-backend/`:
```
tpc-backend/
├── PPO_IMPORT_GUIDE.md              ← Technical guide
├── PPO_IMPORT_QUICKSTART.md         ← Quick start guide
├── src/
│   ├── services/
│   │   ├── PPOUploadService.ts      ← Core service
│   │   └── DataCliModule.ts         ← Updated module
│   └── upload-ppo-data.ts           ← CLI script
├── resources/
│   └── ppo-sample-data.csv          ← Sample data
└── package.json                      ← Added npm script
```

## Questions?

Refer to:
1. **`PPO_IMPORT_QUICKSTART.md`** - For step-by-step instructions
2. **`PPO_IMPORT_GUIDE.md`** - For technical details
3. **`resources/ppo-sample-data.csv`** - For data format example

## Summary

✅ **Solution Ready**: Complete PPO import system implemented
✅ **Dashboard Compatible**: Creates OnCampusOffers that appear in analytics
✅ **Easy to Use**: Single npm command to import data
✅ **Production Ready**: Error handling, validation, logging included
✅ **Documented**: Comprehensive guides provided

**You can now import your PPO data and see it in the dashboard! 🎉**

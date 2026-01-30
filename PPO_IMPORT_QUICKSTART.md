# PPO Data Import - Quick Start Guide

## Overview
This guide will help you import PPO (Pre-Placement Offer) data into the TPC system so that it appears in the analytics dashboard.

## Prerequisites

1. **Season ID**: You need the UUID of the placement season
   - Get it from: `/api/v1/seasons` endpoint
   - Or from the seasons table in database

2. **CSV/Excel File**: Prepare your PPO data file
   - See `resources/ppo-sample-data.csv` for format reference

## CSV File Format

### Minimum Required Columns (in order):

1. S NO
2. Name
3. Official Email
4. Department
5. Gender
6. Date of Birth
7. Personal Email
8. Birth Category
9. Contact No.
10. Internship Company
11. Stipend p/m
12. Others (for accommodation etc)
13. PPO- CTC (in Lakhs)
14. Offer rcd date
15. FTE-Company Name Final offer
16. Job Title
17. 1st year CTC (in Lakhs)
18. Overall CTC (in Lakhs)

### Example Row:
```csv
1,ATHARVA NANOTI,cse220001013@iiti.ac.in,Computer Science & Engineering,M,11/14/2003,atharva.nanoti.14@gmail.com,gen,7414924595,Quadeye,500000,500000,93,7/16/2025,Quadeye (PPO),Quant Role,103,103
```

**Important Notes:**
- CTC values should be in **Lakhs** (e.g., 103 for ₹1.03 Crore)
- Stipend should be in **Rupees** (e.g., 500000 for ₹5 Lakh)
- Category should be: `gen`, `obc_nc`, `sc`, `st`, or `ews`
- Gender should be: `M`, `F`, or `Other`

## Step-by-Step Import Process

### Step 1: Get Season ID

Find your placement season ID:

```bash
# Using curl
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/v1/seasons

# Or check the database
SELECT id, type, year FROM "Season";
```

Example output:
```json
{
  "id": "abc-123-def-456",
  "type": "PLACEMENT",
  "year": "2024-25"
}
```

### Step 2: Prepare Your Data File

1. Use the sample CSV as template: `resources/ppo-sample-data.csv`
2. Ensure all required columns are present
3. Save as `.csv` or `.xlsx` format

### Step 3: Run the Import

#### Option A: Students Already Exist in Database

If students are already registered in the system:

```bash
npm run upload:ppo ./path/to/ppo-data.csv <SEASON_ID>
```

Example:
```bash
npm run upload:ppo ./resources/ppo-data.csv abc-123-def-456
```

#### Option B: Create New Students

If students don't exist, provide year and course:

```bash
npm run upload:ppo ./path/to/ppo-data.csv <SEASON_ID> <YEAR> <COURSE>
```

Example:
```bash
npm run upload:ppo ./resources/ppo-data.csv abc-123-def-456 "3" "BTECH"
```

Where:
- **YEAR**: "3" for Third Year, "4" for Fourth Year, etc.
- **COURSE**: "BTECH", "MTECH", "MS", "PHD", etc.

### Step 4: Verify Import

Check the output for success/error messages:

```
🚀 Starting PPO data upload...
📁 File: ./resources/ppo-data.csv
🏫 Season ID: abc-123-def-456
✅ Season validated: PLACEMENT 2024-25
📊 Found 3 rows to process

📝 Processing S.No 1: ATHARVA NANOTI
  Found existing student: cse220001013
  ✓ Company: Quadeye
  ✓ Recruiter created/found
  ✓ Job created: Quant Role
  ✓ Salary created: ₹10300000
  ✅ OnCampusOffer created: xyz-789-abc

============================================================
✅ PPO Upload Complete!
   Success: 3 records
   Errors: 0 records
============================================================
```

## Verification in Dashboard

After successful import, verify data appears in analytics dashboard:

### 1. Check API Endpoints

```bash
# Overall statistics
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/v1/analytics-dashboard/statsOverall/abc-123-def-456

# Department-wise stats
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/v1/analytics-dashboard/statsDepartmentWise/abc-123-def-456
```

### 2. Check Dashboard UI

Navigate to: `http://localhost:3000/admin/dashboard`

You should see:
- ✅ Total offers increased
- ✅ Placement percentage updated
- ✅ Package statistics include PPO offers
- ✅ Companies count updated

## Troubleshooting

### Error: "Student not found"

**Solution**: Provide year and course parameters:
```bash
npm run upload:ppo ./data.csv <SEASON_ID> "3" "BTECH"
```

### Error: "Program not found"

**Cause**: Department name doesn't match program in database

**Solution**: Check department names in database:
```sql
SELECT DISTINCT branch FROM "Program";
```

Ensure your CSV uses exact same names.

### Error: "Season not found"

**Cause**: Invalid Season ID

**Solution**: Get correct season ID:
```sql
SELECT id, type, year FROM "Season";
```

### Offers Not Appearing in Dashboard

**Cause**: Data imported as OffCampusOffer instead of OnCampusOffer

**Solution**: The provided script creates OnCampusOffers. Verify by checking:
```sql
SELECT COUNT(*) FROM "OnCampusOffer" WHERE "studentId" IN (
  SELECT s.id FROM "Student" s 
  JOIN "User" u ON s."userId" = u.id 
  WHERE u.email LIKE '%@iiti.ac.in'
);
```

## Advanced Usage

### Custom Column Mapping

If your CSV has different column order, edit `/src/services/PPOUploadService.ts`:

```typescript
const columnMap: { [index: number]: keyof IPPORowType } = {
  0: "sNo",
  1: "name",
  2: "officialEmail",
  // ... adjust indices to match your CSV
};
```

### Add Roll Numbers

If your students have roll numbers, add a column in CSV and update the mapping:

```csv
S NO,Name,Roll No,Official Email,...
1,ATHARVA NANOTI,220001013,cse220001013@iiti.ac.in,...
```

Then update the interface in `PPOUploadService.ts`.

### Batch Import Multiple Files

```bash
for file in ./ppo-data/*.csv; do
  npm run upload:ppo "$file" abc-123-def-456
done
```

## Production Deployment

### 1. Build the project
```bash
npm run build
```

### 2. Run the compiled script
```bash
node dist/upload-ppo-data.js ./data.csv <SEASON_ID>
```

### 3. Add to cron job (optional)
```bash
# Add to crontab
0 2 * * * cd /path/to/tpc-backend && node dist/upload-ppo-data.js /path/to/daily-ppo.csv <SEASON_ID>
```

## Data Validation

The script performs these validations:

- ✅ Season exists
- ✅ File exists and is readable
- ✅ Required columns present
- ✅ Valid email format
- ✅ Valid category values
- ✅ Valid gender values
- ✅ CTC values are numbers
- ✅ Company names are not empty

## Metadata Stored

Each OnCampusOffer stores metadata about the PPO:

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

Access this in queries:
```sql
SELECT metadata FROM "OnCampusOffer" WHERE metadata::text LIKE '%PPO_IMPORT%';
```

## Support

For issues or questions:
1. Check the logs for detailed error messages
2. Verify CSV format matches the template
3. Ensure database connection is working
4. Check that season and programs exist in database

## Next Steps

After successful import:
1. ✅ Verify dashboard shows correct statistics
2. ✅ Check individual student offers
3. ✅ Update any missing student details
4. ✅ Generate placement reports
5. ✅ Share dashboard with stakeholders

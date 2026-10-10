# NutriiApp - Database Schema

Table: `meal_records`

Each row is one meal entry. Dashboard groups by `log_date` for the current user to show daily value.

- `id`: uuid, primary key
- `owner_id`: uuid NOT NULL, references `profiles(id)` (the uploader); RLS restricts all access to the owning user
- `log_date`: date, the day the meal belongs to, no future dates
- `meal_category`: text, breakfast, lunch, dinner, snack, etc.
- `food_text`: text, free text entry e.g. rice
- `quantity`: numeric, amount eaten e.g. 1
- `unit`: text, portion unit e.g. plate
- `carbohydrates`: numeric, locked in by API or AI model
- `proteins`: numeric, locked in by API or AI model
- `fats`: numeric, locked in by API or AI model
- `vitamins`: numeric, locked in by API or AI model
- `minerals`: numeric, locked in by API or AI model
- `water`: numeric, locked in by API or AI model
- `created_at`: timestamptz, when the entry was created
- `updated_at`: timestamptz, when the entry was last edited

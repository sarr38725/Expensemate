/*
  # Create Transactions Table for ExpenseMate

  1. New Tables
    - `transactions`
      - `id` (uuid, primary key)
      - `user_email` (text) - User identifier
      - `amount` (numeric) - Transaction amount
      - `category` (text) - Transaction category
      - `type` (text) - Income or Expense
      - `date` (timestamptz) - Transaction date
      - `description` (text) - Transaction description
      - `created_at` (timestamptz) - Record creation timestamp

  2. Security
    - Enable RLS on `transactions` table
    - Add policy for users to read their own transactions
    - Add policy for users to insert their own transactions
    - Add policy for users to update their own transactions
    - Add policy for users to delete their own transactions
*/

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  category text NOT NULL,
  type text NOT NULL CHECK (type IN ('Income', 'Expense')),
  date timestamptz NOT NULL DEFAULT now(),
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (user_email = auth.jwt()->>'email');

CREATE POLICY "Users can insert own transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_email = auth.jwt()->>'email');

CREATE POLICY "Users can update own transactions"
  ON transactions
  FOR UPDATE
  TO authenticated
  USING (user_email = auth.jwt()->>'email')
  WITH CHECK (user_email = auth.jwt()->>'email');

CREATE POLICY "Users can delete own transactions"
  ON transactions
  FOR DELETE
  TO authenticated
  USING (user_email = auth.jwt()->>'email');

CREATE INDEX IF NOT EXISTS idx_transactions_user_email ON transactions(user_email);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);

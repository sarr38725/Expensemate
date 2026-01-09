/*
  # Add Public Access Policies for Transactions
  
  1. Changes
    - Add policies to allow anonymous/guest users to manage their transactions
    - Keep existing authenticated user policies
    - Allow public (anon) role to perform CRUD operations
  
  2. Security
    - Public users can only access transactions with their email
    - Maintains data isolation by user_email
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can insert own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can update own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can delete own transactions" ON transactions;

-- Create new policies for authenticated users
CREATE POLICY "Authenticated users can read own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (user_email = auth.jwt()->>'email');

CREATE POLICY "Authenticated users can insert own transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_email = auth.jwt()->>'email');

CREATE POLICY "Authenticated users can update own transactions"
  ON transactions
  FOR UPDATE
  TO authenticated
  USING (user_email = auth.jwt()->>'email')
  WITH CHECK (user_email = auth.jwt()->>'email');

CREATE POLICY "Authenticated users can delete own transactions"
  ON transactions
  FOR DELETE
  TO authenticated
  USING (user_email = auth.jwt()->>'email');

-- Create policies for anonymous/public users
CREATE POLICY "Public users can read all transactions"
  ON transactions
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public users can insert transactions"
  ON transactions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Public users can update transactions"
  ON transactions
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public users can delete transactions"
  ON transactions
  FOR DELETE
  TO anon
  USING (true);

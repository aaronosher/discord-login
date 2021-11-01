import { Nullable, Optional } from "./utils";

export type Ticket = {
  id: number;
  slug: string;
  company: string;
  email: string;
  metadata: Record<string, unknown>;
  first_name: string;
  last_name: string;
  name: string;
  number: Nullable<number>;
  phone_number: string;
  price: string;
  reference: string;
  state: string;
  test_mode: boolean;
  registration_id: string;
  consented_at: Nullable<string>;
  discount_code_used: Nullable<string>;
  created_at: string;
  responses: Optional<Nullable<Record<string, unknown>>>;
  assigned: Optional<boolean>;
  price_less_tax: Optional<string>;
  total_paid: Optional<string>;
  total_tax_paid: Optional<string>;
  total_paid_less_tax: Optional<string>;
  tags: Nullable<Array<string>>;
  upgrade_ids: Array<string>;
  registration_slug: string;
  release_slug: Optional<string>;
  release_title: string;
  registration: Optional<Record<string, unknown>>;
  release: Optional<Record<string, unknown>>;
  unique_url: string;
};

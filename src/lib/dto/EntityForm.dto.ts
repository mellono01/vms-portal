import type { Entity } from '@/lib/dto/Entity.dto';
import type { Form } from '@/lib/dto/Form.dto';

export interface EntityForm extends Entity {
  PhoneNumber?: string;
  EmailAddress?: string;
  OrganisationName?: string;
  OrganisationAbn?: string;
  Forms: Form[];
}
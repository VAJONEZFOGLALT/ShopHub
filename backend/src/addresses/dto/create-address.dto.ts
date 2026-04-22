export class CreateAddressDto {
  userId: number;
  label: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
  isDefault?: boolean;
}

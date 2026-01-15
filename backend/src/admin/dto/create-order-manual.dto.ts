import { IsString, IsOptional, IsArray, IsNumber, Min, Max, IsObject, ValidateNested, MaxLength, IsEnum, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

class CustomerDataDto {
  @IsString({ message: 'El nombre del cliente debe ser un texto' })
  name: string;

  @IsString({ message: 'El teléfono del cliente debe ser un texto' })
  phone: string;

  @IsString({ message: 'El email del cliente debe ser un texto' })
  @IsOptional()
  email?: string;

  @IsString({ message: 'El distrito del cliente debe ser un texto' })
  @IsOptional()
  district?: string;
}

export class CreateOrderManualDto {
  @IsString({ message: 'El ID de la rifa es requerido' })
  raffleId: string;

  @IsObject({ message: 'Los datos del cliente son requeridos' })
  @ValidateNested()
  @Type(() => CustomerDataDto)
  customer: CustomerDataDto;

  @IsArray({ message: 'Los boletos deben ser un array' })
  @IsNumber({}, { each: true, message: 'Cada boleto debe ser un número' })
  @Min(1, { each: true, message: 'Cada boleto debe ser al menos 1' })
  tickets: number[];

  @IsArray({ message: 'Los boletos de regalo deben ser un array' })
  @IsNumber({}, { each: true, message: 'Cada boleto de regalo debe ser un número' })
  @IsOptional()
  giftTickets?: number[];

  @IsNumber({}, { message: 'El total debe ser un número' })
  @Min(0, { message: 'El total no puede ser negativo' })
  total: number;

  @IsEnum(['PENDING', 'PAID', 'COMPLETED'], { message: 'El estado debe ser PENDING, PAID o COMPLETED' })
  @IsOptional()
  status?: 'PENDING' | 'PAID' | 'COMPLETED';

  @IsString({ message: 'El método de pago debe ser un texto' })
  @IsOptional()
  @MaxLength(100, { message: 'El método de pago no puede tener más de 100 caracteres' })
  paymentMethod?: string;

  @IsString({ message: 'Las notas deben ser un texto' })
  @IsOptional()
  @MaxLength(1000, { message: 'Las notas no pueden tener más de 1000 caracteres' })
  notes?: string;
}


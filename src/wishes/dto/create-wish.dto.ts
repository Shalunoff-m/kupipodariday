import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  Length,
  Min,
} from 'class-validator';

export class CreateWishDto {
  @IsUrl()
  @IsNotEmpty()
  image: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 250)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 1024)
  description: string;

  @IsUrl()
  @IsNotEmpty()
  link: string;

  @IsNumber()
  @Min(1)
  price: number;
}

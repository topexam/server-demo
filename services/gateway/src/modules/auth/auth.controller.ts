import {
  Controller,
  UsePipes,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Inject,
  OnModuleInit,
} from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JoiValidationPipe } from '@topexam/api.lib.common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  ACCOUNT_SERVICE_NAME,
  AccountServiceClient,
} from '@topexam/api.service.proto/dist/__generated__/account.pb';

import { loopbackGrpcRequest } from '@/utils';
import {
  CreateAccountValidationSchema,
  RegisterValidationSchema,
  LoginValidationSchema,
  UpdatePasswordValidationSchema,
} from './validations';
import {
  RegisterInputDTO,
  LoginInputDTO,
  UpdatePasswordInputDTO,
  CreateAccountDTO,
} from './dto';
import {
  AUTH_MODULE_NAME,
  AUTH_MODULE_SERVICE,
  AUTH_MODULE_PREFIX,
} from './constant';

@ApiTags(AUTH_MODULE_NAME)
@ApiSecurity('X-API-KEY')
@Controller(AUTH_MODULE_PREFIX)
export class AuthController implements OnModuleInit {
  accountSrv: AccountServiceClient;
  constructor(@Inject(AUTH_MODULE_SERVICE) private client: ClientGrpc) {}

  onModuleInit() {
    this.accountSrv = this.client.getService(ACCOUNT_SERVICE_NAME);
  }

  @Get('account/item/:userNameOrEmail')
  getAccount(@Param('userNameOrEmail') userNameOrEmail: string): any {
    return loopbackGrpcRequest(
      this.accountSrv.getAccountItem({ userNameOrEmail }),
    );
  }

  @Post('login')
  @UsePipes(new JoiValidationPipe(LoginValidationSchema))
  login(@Body() loginInputDTO: LoginInputDTO): any {
    return loopbackGrpcRequest(this.accountSrv.login(loginInputDTO));
  }

  @Post('register')
  @UsePipes(new JoiValidationPipe(RegisterValidationSchema))
  register(@Body() registerInputDTO: RegisterInputDTO): any {
    return loopbackGrpcRequest(this.accountSrv.register(registerInputDTO));
  }

  @Patch('account:verify-account/:email')
  verifyAccount(@Param('email') email: string): any {
    return loopbackGrpcRequest(this.accountSrv.verifyAccount({ email }));
  }

  @Patch('account:update-password/:email')
  @UsePipes(new JoiValidationPipe(UpdatePasswordValidationSchema))
  updatePassword(
    @Param('email') email: string,
    @Body() updatePasswordInputDTO: UpdatePasswordInputDTO,
  ): any {
    return loopbackGrpcRequest(
      this.accountSrv.updatePassword({
        email,
        data: updatePasswordInputDTO,
      }),
    );
  }

  @Delete('account:delete-account/:email')
  deleteAccount(@Param('email') email: string): any {
    return loopbackGrpcRequest(this.accountSrv.deleteAccount({ email }));
  }

  @Post('account:create-account')
  @UsePipes(new JoiValidationPipe(CreateAccountValidationSchema))
  createAccount(@Body() createAccountDTO: CreateAccountDTO): any {
    return loopbackGrpcRequest(this.accountSrv.createAccount(createAccountDTO));
  }
}

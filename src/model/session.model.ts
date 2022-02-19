import {
  getModelForClass,
  ModelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { User } from './user.model';

@ModelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Session {
  @prop({ ref: () => User })
  user: Ref<User>;

  @prop({ default: true })
  valid: boolean;
}

const SessionModel = getModelForClass(Session);

export default SessionModel;

import { injectable } from 'src/base/common/injector';

@injectable('EnvironmentService')
export default class EnvironmentService {
  globalWindowIds: Record<string, any> = {};
}

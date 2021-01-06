//todo : use different db collection for tests - mongodb-memory-server?

import { request, should, use } from 'chai';
import chaiHttp from 'chai-http';

use(chaiHttp);

export { request, should };

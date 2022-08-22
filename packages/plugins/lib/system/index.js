import reducers from './reducers';
import routes from './routes';
import actions from './actions';
import { getNavItem } from './nav-item';

export default {
  key: 'system',
  name: '系统管理',
  reducers,
  routes,
  actions,
  getNavItem,
};

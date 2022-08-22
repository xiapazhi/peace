import reducers from './reducers';
import routes from './routes';
import actions from './actions';
import { getNavItem } from './nav-item';

export default {
  key: 'alarm',
  name: '告警管理',
  reducers,
  routes,
  actions,
  getNavItem,
};

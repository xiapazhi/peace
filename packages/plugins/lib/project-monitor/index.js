import routes from './routes';
import reducers from './reducers';
import actions from './actions';
import { getNavItem } from './containers/nav-item';

export default {
  key: 'project-monitor',
  name: '项目管理',
  reducers,
  routes,
  actions,
  getNavItem,
};

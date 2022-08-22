import reducers from './reducers';
import routes from './routes';
import actions from './actions';
import { getNavItem } from './nav-item';

export default {
  key: 'superScreen',
  name: '大屏',
  reducers,
  routes,
  actions,
  getNavItem
};

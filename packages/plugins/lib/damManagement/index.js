'use strict';

import reducers from './reducers';
import routes from './routes';
import actions from './actions';
import { getNavItem } from './nav-item';

export default {
    key: 'dam',
    name: '大坝管理',
    reducers: reducers,
    routes: routes,
    actions: actions,
    getNavItem: getNavItem
};
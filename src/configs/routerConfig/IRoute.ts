import IPageProps from './IPageProps';
import RouteType from './RouteType';

interface IRoute {
  path: string;
  name?: string;
  component: any;
  type: RouteType;
  props?: IPageProps;
}

export default IRoute;

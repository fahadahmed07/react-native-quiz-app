import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import * as Routes from '../screens/index';

const MainNavigator = createSwitchNavigator({
    Home: Routes.Home,
    Quiz: Routes.Quiz,
    Result: Routes.Result,
})

export default createAppContainer(MainNavigator);


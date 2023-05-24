import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import theme from './styles/theme';
import { NavigationContainer } from '@react-navigation/native';
import Categories from './screens/Categories';
import Languages from './screens/Languages';
import {
  createStackNavigator,
  TransitionSpecs,
  HeaderStyleInterpolators,
} from '@react-navigation/stack';
import {BackIcon, LanguagesIcon, SearchIcon, ShareIcon} from "./components/Icons";
import shareApp from './components/Share';
import HeaderTitle from "./components/HeaderTitle";
import {goBackSafe} from "./utils/GoBackSafe/GoBackSafe";
import Knot from "./screens/Knot";
import Knots from "./screens/Knots";
// import { showInterstitialAd } from './components/AdMob';


const Stack = createStackNavigator();
export const selectLang = {
};
const MyTransition = {
  gestureDirection: 'horizontal',
  transitionSpec: {
    open: TransitionSpecs.TransitionIOSSpec,
    close: TransitionSpecs.TransitionIOSSpec,
    duration: 0,
  },
  headerStyleInterpolator: HeaderStyleInterpolators.forFade,
};


export default React.memo(() => (
  <SafeAreaView style={styles.container}>
      <StatusBar
          style="dark"
          translucent={true}
          hidden={false}
      />
          <NavigationContainer>
                {/*Navigator param*/}
                <Stack.Navigator
                  screenOptions={{
                    ...MyTransition,
                    headerTintColor: 'white',
                    headerStyle: styles.navigation,
                    headerTitleAlign: 'center',
                  }}
                >
                  {/*First screen*/}
                  <Stack.Screen
                    name="Categories"
                    component={Categories}
                    options={({ navigation, route: { params } }) => ({
                      headerTitle: () => <HeaderTitle title="Useful Knots 3d" />,
                      headerRight: () => (
                        <View style={styles.headerRight}>
                          <LanguagesIcon
                            onPress={() =>
                              navigation.navigate('Languages', {
                                langCode: params,
                              })
                            }
                            style={{ width: 30 }}
                          />
                        </View>
                      ),
                      headerLeft: () => (
                        <View style={styles.headerLeft}>
                          <ShareIcon
                              onPress={() => shareApp(params)}
                            style={{ width: 30 }}
                          />
                        </View>
                      ),
                    })}
                  />
                    {/*Second screen*/}
                    <Stack.Screen
                        name="Languages"
                        component={Languages}
                        options={({ navigation, route: { params } }) => ({
                            headerTitle: () => (
                                <HeaderTitle title={selectLang[`name_${params}`]} />
                            ),
                            headerLeft: () => (
                                <View style={styles.headerLeft}>
                                    <BackIcon
                                        onPress={() => goBackSafe(navigation)}
                                        style={{ width: 30 }}
                                    />
                                </View>
                            ),
                        })}
                    />
                    {/*/!*Third screen*!/*/}
                    <Stack.Screen
                        name="Knots"
                        component={Knots}
                        options={({ navigation, route: { params } }) => ({
                            headerTitle: () => <HeaderTitle title={params.title} />,
                            headerRight: () => (
                                <View style={styles.headerRight}>
                                    <SearchIcon />
                                </View>
                            ),
                            headerLeft: () => (
                                <View style={styles.headerLeft}>
                                    <BackIcon
                                        onPress={async () => {
                                            // showInterstitialAd();
                                            goBackSafe(navigation);
                                        }}
                                        style={{ width: 30 }}
                                    />
                                </View>
                            ),
                        })}
                    />
                    {/*Forth screen*/}
                    <Stack.Screen
                        key="knot"
                        name="Knot"
                        component={Knot}
                        options={({ navigation, route: { params } }) => ({
                            headerTitle: () => <HeaderTitle title={params.title} />,
                            headerLeft: () => (
                                <View style={styles.headerLeft}>
                                    <BackIcon
                                        onPress={() => {
                                            // showInterstitialAd()
                                            goBackSafe(navigation)
                                        }}
                                        style={{ width: 30 }}
                                    />
                                </View>
                            ),
                        })}
                    />
                  </Stack.Navigator>
                  </NavigationContainer>
  </SafeAreaView>
));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  navigation: {
    backgroundColor: theme.navigationBackground,
  },
  headerLeft: {
    marginLeft: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  headerRight: {
    marginRight: 15,
  },
});

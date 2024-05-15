/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  DdSdkReactNative,
  DatadogProviderConfiguration,
  DatadogProvider,
  DdLogs,
  ErrorSource,
  RumActionType,
  DdRum,
  SdkVerbosity,
  UploadFrequency,
  BatchSize,
} from '@datadog/mobile-react-native';

import {
  DdRumReactNavigationTracking,
  ViewNamePredicate,
} from '@datadog/mobile-react-navigation';
import type { PropsWithChildren } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  Image,
} from 'react-native';

import { NavigationContainer, Route } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { DD_RUM_CLIENT_TOKEN, DD_RUM_APPLICATION_ID } from '@env';

const config = new DatadogProviderConfiguration(
  DD_RUM_CLIENT_TOKEN,
  "staging",
  DD_RUM_APPLICATION_ID,
  true, // track User interactions (e.g.: Tap on buttons. You can use 'accessibilityLabel' element property to give tap action the name, otherwise element type will be reported)
  true, // track XHR Resources
  true // track Errors
)
// Optional: Select your Datadog website (one of "US1", "EU1", "US3", "US5", "AP1" or "GOV")
config.site = "US1"
// Optional: Enable JavaScript long task collection
config.longTaskThresholdMs = 100
// Optional: enable or disable native crash reports
config.nativeCrashReportEnabled = true
// Optional: sample RUM sessions (here, 100% of session will be sent to Datadog. Default = 100%)
config.sampleRate = 100
config.version = "1.0.27"
config.verbosity = SdkVerbosity.DEBUG

if (__DEV__) {
  // Optional: Send data more frequently
  config.uploadFrequency = UploadFrequency.FREQUENT
  // Optional: Send smaller batches of data
  config.batchSize = BatchSize.SMALL
  // Optional: Enable debug logging
  config.verbosity = SdkVerbosity.DEBUG
}

config.firstPartyHosts = ["https://randomuser.me/api/"];

//Wrap the content of your App component by a DatadogProvider component, passing it your configuration:
/*export default function App() {
  return (
      <DatadogProvider configuration={config}>
          <Navigation />
      </DatadogProvider>
  );
}
*/

// Once SDK is initialized you need to setup view tracking to be able to see data in the RUM Dashboard.

const Stack = createNativeStackNavigator();

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({ children, title }: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  var [userFirstName, setUserFirstname] = useState('');
  var [userLastName, setUserLastName] = useState('');
  var [pictureURL, setPictureURL] = useState('');
  var [userEmail, setUserEmail] = useState('');
  var [userId, setUserId] = useState('');

  const changeUser = () => {
    axios({
      method: 'get',
      url: 'https://randomuser.me/api/',
    }).then(response => {
      let userDataResults = response.data.results[0];
      setUserFirstname(userFirstName => userDataResults.name.first);
      setUserLastName(userLastname => userDataResults.name.last);
      setPictureURL(pictureURL => userDataResults.picture.large);
      setUserEmail(userEmail => userDataResults.email);
      setUserId(userId => userDataResults.login.uuid);

      DdSdkReactNative.setUser({
        id: userDataResults.login.uuid,
        name: userDataResults.name.first + ' ' + userDataResults.name.last,
        email: userDataResults.email,
        type: 'premium',
      });
    });
  };

  const changeUserImage = () => {
    axios({
      method: 'get',
      url: 'https://randomuser.me/api/',
    }).then(response => {
      let userDataResults = response.data.results[0];
      setPictureURL(pictureURL => userDataResults.picture.large);
    });
  };

  const forceCrash = () => {
    const test: any = {};
    console.log(test.should.crash);
  };

  const triggerCrash = () => {
    const obj = {};
    const a = obj.name.surname;
  };

  const createLoggerErrorLog = () => {
    DdLogs.error("Unknown error - DdLogs");
    DdRum.addError('Test Error', ErrorSource.SOURCE, '<stacktrace>', {}, Date.now());
    console.error("Console level error")
  }

  const createConsoleErrorLog = () => {
    console.error("Unknown error - console");
  }

  const generateInfoLog = () => {

    const context = {
      "context": {
        "app_id": "Cvent Events",
        "application_version": "0.0.0.1",
        "attendeeId": "7d62fc4b-08a0-4f32-989e-16eaaedb26d4",
        "cvent_app_id": "28677ebd-b2db-46c4-9ed4-f90db9adea1f",
        "cvent_version": "0.0.0-1",
        "device_id": "84eb287f-7bd4-4147-a550-60b3c5abe105",
        "device_model": "iPhone",
        "eventId": "ff6775c1-c849-4299-9cb0-68e91c8b1dc3",
        "event_id": "ff6775c1-c849-4299-9cb0-68e91c8b1dc3",
        "language": "en-IN",
        "os": "ios",
        "os_version": "17.2",
        "timezone": "America/Los_Angeles"
      }
    }

    DdLogs.info("Here's a React Native INFO log", context)
  }

  const generateDebugLog = () => {
    const context = {
      "context": {
        "app_id": "Cvent Events",
        "application_version": "0.0.0.1",
        "attendeeId": "7d62fc4b-08a0-4f32-989e-16eaaedb26d4",
        "cvent_app_id": "28677ebd-b2db-46c4-9ed4-f90db9adea1f",
        "cvent_version": "0.0.0-1",
        "device_id": "84eb287f-7bd4-4147-a550-60b3c5abe105",
        "device_model": "iPhone",
        "eventId": "ff6775c1-c849-4299-9cb0-68e91c8b1dc3",
        "event_id": "ff6775c1-c849-4299-9cb0-68e91c8b1dc3",
        "language": "en-IN",
        "os": "ios",
        "os_version": "17.2",
        "timezone": "America/Los_Angeles"
      },
      "logger": {
        "name": "DatadogLoggingTester"
      }
    }
    const message = "resolved via query";
    DdLogs.debug(message, context);
  }

  const HomeScreen = ({ navigation }: { navigation: any }) => {
    return (
      <View>
        <SafeAreaView style={backgroundStyle}>
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={backgroundStyle.backgroundColor}
          />
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={backgroundStyle}>
            <View>
              <Text style={styles.titleText}>
                {userId !== ''
                  ? 'Welcome, ' + userFirstName + ' ' + userLastName + '!'
                  : ''}
              </Text>
              <Image
                style={styles.logo}
                source={
                  pictureURL !== ''
                    ? { uri: pictureURL }
                    : require('./images/dd_logo_v_rgb.png')
                }
              />
            </View>
            <View
              style={{
                backgroundColor: isDarkMode ? Colors.black : Colors.white,
              }}>
              <Section title="Generate an Resource" style={styles.sectionHeader}>
                <View>
                  <View style={styles.buttonContainer}>
                    <Button
                      color="#65626a"
                      title="Change User Image"
                      onPress={changeUserImage}
                    />
                  </View>
                </View>
              </Section>
              <Section title="Generate an Error">
                <View>
                  <View style={styles.buttonContainer}>
                    <Button
                      color="#e0115f"
                      title={'Crash App'}
                      onPress={forceCrash}
                    />
                  </View>
                  <View style={styles.buttonContainer}>
                    <Button
                      color="#e0115f"
                      title={'Create Logger Error Log'}
                      onPress={createLoggerErrorLog}
                    />
                  </View>
                  <View style={styles.buttonContainer}>
                    <Button
                      color="#e0115f"
                      title={'Create Console Error Log'}
                      onPress={createConsoleErrorLog}
                    />
                  </View>
                </View>
              </Section>
              <Section title="Generate Logs">
                <View>
                  <View style={styles.buttonContainer}>
                    <Button
                      color="#FFBF00"
                      title={'Generate Info Log'}
                      onPress={generateInfoLog}
                    />
                  </View>
                  <View style={styles.buttonContainer}>
                    <Button
                      color="#FFBF00"
                      title={'Generate Debug Log'}
                      onPress={generateDebugLog}
                    />
                  </View>
                  </View>
              </Section>
              <Section title="Alternative View">
                <View style={styles.bottomButtonContainer}>
                  <Button
                    color="#009473"
                    title={'New Page/View'}
                    onPress={() => navigation.navigate(AlternateView, {})}
                  />
                </View>
              </Section>
            </View>
     
        </ScrollView>
      </SafeAreaView>
      </View >
    )
}

const AlternateView = () => {
  return (
    <View>
      <Image
        style={styles.alternateLogo}
        source={require('./images/dd_logo_v_rgb.png')}
      />
    </View>
  );
};


let interactive = true;

useEffect(() => {
  //triggerCrash();
  changeUser();
  setUserFirstname(userFirstName => "Cosmo");
  if (!interactive) return;
  void DdRum.addTiming('interactive');
}, [interactive]);

const navigationRef = React.useRef(null);
return (
  <DatadogProvider configuration={config}>
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        DdRumReactNavigationTracking.startTrackingViews(
          navigationRef.current,
        );
      }}>
      <Stack.Navigator initialRouteName="Datadog React Native Metro Sandbox">
        <Stack.Screen
          name="Datadog React Native Metro Sandbox"
          component={HomeScreen}
          options={{
            headerStyle: {
              backgroundColor: '#642ba6',
            },
            headerTitleStyle: {
              color: 'white',
            },
          }}
        />
        <Stack.Screen
          name="AlternateView"
          component={AlternateView}
          options={{
            headerTitle: 'Alternative View',
            headerStyle: {
              backgroundColor: '#642ba6',
            },
            headerTintColor: 'white',
            headerTitleStyle: {
              color: 'white',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  </DatadogProvider>
);
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 24,
    fontWeight: '600',
    color: 'black',
    marginTop: 28,
    marginBottom: 18,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    fontSize: 10
  },
  highlight: {
    fontWeight: '700',
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 18,
  },
  alternateLogo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginTop: 28,
    marginBottom: 18,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  buttonContainer: {
    marginTop: 15,
    paddingRight: 15,
    paddingLeft: 15,
  },
  bottomButtonContainer: {
    marginTop: 15,
    paddingRight: 15,
    paddingLeft: 15,
    paddingBottom: 15,
  },
});

export default App;

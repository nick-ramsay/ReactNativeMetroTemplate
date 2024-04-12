/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type { PropsWithChildren } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {
  BatchSize,
  DatadogProvider,
  DatadogProviderConfiguration,
  SdkVerbosity,
  UploadFrequency,
} from "@datadog/mobile-react-native";

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
config.version = "1.0.0"

if (__DEV__) {
  // Optional: Send data more frequently
  config.uploadFrequency = UploadFrequency.FREQUENT
  // Optional: Send smaller batches of data
  config.batchSize = BatchSize.SMALL
  // Optional: Enable debug logging
  config.verbosity = SdkVerbosity.DEBUG
}

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

  return (
    <DatadogProvider configuration={config}>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={backgroundStyle}>
          <Header />
          <View
            style={{
              backgroundColor: isDarkMode ? Colors.black : Colors.white,
            }}>
            <Section title="Step One">
              Edit <Text style={styles.highlight}>App.tsx</Text> to change this
              screen and then come back to see your edits.
            </Section>
            <Section title="See Your Changes">
              <ReloadInstructions />
            </Section>
            <Section title="Debug">
              <DebugInstructions />
            </Section>
            <Section title="Learn More">
              Read the docs to discover what to do next:
            </Section>
            <LearnMoreLinks />
          </View>
        </ScrollView>
      </SafeAreaView>
    </DatadogProvider>
  );
}

const styles = StyleSheet.create({
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
});

export default App;

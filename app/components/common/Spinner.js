import React from 'react';
import { View, ActivityIndicator} from 'react-native';


const Spinner = () => {
  return (
    <View style={styles.spinnerstyle}>
      <ActivityIndicator  />
    </View>
  );
};

const styles = {
  spinnerstyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
};

export { Spinner };

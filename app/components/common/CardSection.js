import React from 'react';
import { View } from 'react-native';

const CardSection = (props) => {
  return (
    <View style={[styles.containerstyle, props.style]}>
    {props.children}
    </View>
  );
};

const styles = {
  containerstyle: {
    borderBottomWidth: 0,
    flexDirection: 'row',
    position: 'relative',
    alignItems: 'center',
    justifyContent:'flex-start'
  }
};

export {CardSection};

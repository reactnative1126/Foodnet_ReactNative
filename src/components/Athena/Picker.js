import React from "react";
import { Platform, StatusBar, StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Icon } from "react-native-elements";
import { themes, colors } from "@constants/themes";

const Picker = ({ data, one, onSelect }) => {
  return (
    <View style={styles.dialog}>
      <View style={[styles.dialogMain]}>
        <View style={{ width: '90%', marginTop: 10, marginBottom: 5 }}>
          {data.map((item, key) => {
            return (
              <TouchableOpacity key={key} style={styles.item} onPress={() => onSelect(item)}>
                <Text>{item.label}</Text>
                <Icon name='check' type='antdesign' size={20} color={item.value === one.value ? colors.YELLOW.PRIMARY : colors.GREY.PRIMARY} />
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({

  dialog: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('100.0%'),
    height: hp('100.0%'),
    backgroundColor: '#000000BF'
  },
  dialogMain: {
    alignItems: 'center',
    width: wp('50%'),
    backgroundColor: '#FFF',
    zIndex: 1000,
    borderRadius: 5
  },
  dialogHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 50,
    backgroundColor: '#AD7A32',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.9,
    shadowOffset: { height: 2, width: 1 },
    shadowRadius: 5,
    elevation: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 30,
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: colors.BLACK,
    marginBottom: 5
  },
});

export default Picker;
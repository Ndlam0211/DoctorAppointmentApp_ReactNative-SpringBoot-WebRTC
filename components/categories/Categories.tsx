import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import { symptomList } from "@/constants/SymptomsList";
import { COLORS } from "@/constants/Colors";

interface Props {
  onChangeCategory?: (index: number) => void;
}

interface Symptom {
  name: string;
  description: string;
}

const Categories: React.FC<Props> = ({ onChangeCategory }) => {
  const [selected, setSelected] = useState<number>(0);

  const onPress = useCallback(
    (index: number) => {
      setSelected(index);
      onChangeCategory?.(index);
    },
    [onChangeCategory]
  );

  const RenderItem = ({
    name,
    description,
    index,
  }: Symptom & { index: number }) => {
    const isSelected = index === selected;
    return (
      <TouchableOpacity
        onPress={() => onPress(index)}
        style={[
          styles.categoryItem,
          isSelected && { backgroundColor: COLORS.PRIMARY },
        ]}
      >
        <Text style={isSelected ? { color: COLORS.SECONDARY } : null}>
          {name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <FlatList
        data={symptomList}
        horizontal
        style={styles.flatList}
        contentContainerStyle={{ gap: 8 }}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => <RenderItem {...item} index={index} />}
      />
    </View>
  );
};

export default Categories;

const styles = StyleSheet.create({
  flatList: {
    padding: 10,
  },
  categoryItem: {
    backgroundColor: "#E9E9Fe",
    padding: 10,
    borderRadius: 8,
    alignSelf: "center",
  },
});

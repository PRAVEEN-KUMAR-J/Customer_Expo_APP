import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Plus, Minus } from 'lucide-react-native';

interface QuantitySelectorProps {
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
    minValue?: number;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({ quantity, onIncrease, onDecrease, minValue = 1 }) => {
    return (
        <View style={styles.stepperContainer}>
            <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => onDecrease()}
            >
                <Minus size={18} color="#111827" />
            </TouchableOpacity>
            <Text style={styles.stepperValue}>{quantity}</Text>
            <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => onIncrease()}
            >
                <Plus size={18} color="#22C55E" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    stepperContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 20,
        paddingHorizontal: 4,
        paddingVertical: 4,
    },
    stepperBtn: {
        padding: 10,
    },
    stepperValue: {
        fontSize: 16,
        fontWeight: '800',
        color: '#111827',
        marginHorizontal: 12,
        minWidth: 20,
        textAlign: 'center',
    },
});

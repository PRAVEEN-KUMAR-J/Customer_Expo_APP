import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface CategoryCardProps {
    id: string;
    label: string;
    image: string;
    isActive?: boolean;
    onPress: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ label, image, isActive, onPress }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.85}
            onPress={onPress}
            style={styles.quickTile}
        >
            <View style={[styles.quickIconBox, styles.quickIconCircle]}>
                <Image source={{ uri: image }} style={styles.quickIconCircleImage} />
            </View>
            <Text style={[styles.quickLabel, isActive && styles.quickLabelActive]} numberOfLines={2}>
                {label}
            </Text>
            <View style={[styles.quickUnderline, isActive && styles.quickUnderlineActive]} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    quickTile: {
        alignItems: 'center',
        width: 68,
    },
    quickIconBox: {
        padding: 2,
        marginBottom: 8,
    },
    quickIconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        overflow: 'hidden',
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    quickIconCircleImage: {
        width: '100%',
        height: '100%',
    },
    quickLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: '#4B5563',
        textAlign: 'center',
        lineHeight: 14,
    },
    quickLabelActive: {
        color: '#F97316',
        fontWeight: '700',
    },
    quickUnderline: {
        height: 3,
        width: 20,
        backgroundColor: 'transparent',
        borderRadius: 1.5,
        marginTop: 6,
    },
    quickUnderlineActive: {
        backgroundColor: '#F97316',
    },
});

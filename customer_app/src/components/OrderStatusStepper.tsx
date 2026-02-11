import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CircleCheck as CheckCircle, Package, Truck, MapPin } from 'lucide-react-native';
import { OrderStatus } from '../data/orders';

interface OrderStatusStepperProps {
  currentStatus: OrderStatus;
}

const statusSteps = [
  { key: 'confirmed' as OrderStatus, label: 'Confirmed', icon: CheckCircle },
  { key: 'packed' as OrderStatus, label: 'Packed', icon: Package },
  { key: 'out_for_delivery' as OrderStatus, label: 'Out for Delivery', icon: Truck },
  { key: 'delivered' as OrderStatus, label: 'Delivered', icon: MapPin },
];

export const OrderStatusStepper: React.FC<OrderStatusStepperProps> = ({ currentStatus }) => {
  const currentStepIndex = statusSteps.findIndex(step => step.key === currentStatus);
  
  return (
    <View style={styles.container}>
      {statusSteps.map((step, index) => {
        const isCompleted = index <= currentStepIndex;
        const isActive = index === currentStepIndex;
        const IconComponent = step.icon;
        
        return (
          <View key={step.key} style={styles.stepContainer}>
            <View style={styles.stepContent}>
              <View style={[
                styles.iconContainer,
                isCompleted ? styles.completedIcon : styles.pendingIcon,
                isActive && styles.activeIcon
              ]}>
                <IconComponent 
                  size={20} 
                  color={isCompleted ? '#FFFFFF' : '#9CA3AF'} 
                />
              </View>
              
              <Text style={[
                styles.stepLabel,
                isCompleted ? styles.completedLabel : styles.pendingLabel
              ]}>
                {step.label}
              </Text>
            </View>
            
            {index < statusSteps.length - 1 && (
              <View style={[
                styles.connector,
                index < currentStepIndex ? styles.completedConnector : styles.pendingConnector
              ]} />
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  stepContainer: {
    flex: 1,
    alignItems: 'center',
  },
  stepContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  completedIcon: {
    backgroundColor: '#22C55E',
  },
  activeIcon: {
    backgroundColor: '#22C55E',
    transform: [{ scale: 1.1 }],
  },
  pendingIcon: {
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  stepLabel: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  completedLabel: {
    color: '#22C55E',
  },
  pendingLabel: {
    color: '#9CA3AF',
  },
  connector: {
    position: 'absolute',
    top: 20,
    left: '50%',
    right: -50,
    height: 2,
    zIndex: -1,
  },
  completedConnector: {
    backgroundColor: '#22C55E',
  },
  pendingConnector: {
    backgroundColor: '#E5E7EB',
  },
});
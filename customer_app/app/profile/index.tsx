import React from 'react';
import { Redirect } from 'expo-router';

export default function ProfileIndex() {
  return <Redirect href="/profile/details" />;
}


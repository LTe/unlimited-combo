import React, { useEffect, useState } from 'react';
import DarkModeToggle from 'react-dark-mode-toggle';
// @ts-ignore
import nightwind from 'nightwind/helper';

export const DarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => false);

  const changeHandler = (isDark: boolean) => {
    setIsDarkMode(isDark);
    nightwind.toggle();
  };

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  return (
    <div>
      <DarkModeToggle onChange={changeHandler} checked={isDarkMode} size={50} />
    </div>
  );
};

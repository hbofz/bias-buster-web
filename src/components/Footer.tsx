
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t bg-muted/50 py-6">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-center text-sm text-muted-foreground md:text-left">
          © 2023 BiasBuster. Educational Project for Ethical Issues in Software Design.
        </p>
        <p className="text-center text-sm text-muted-foreground md:text-right">
          All case studies and data are for educational purposes only.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

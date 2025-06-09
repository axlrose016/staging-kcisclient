interface ErrorProps {
    errors: {
      [key: string]: string[]; // Adjusted type to map field names to an array of error messages
    };
  }
  
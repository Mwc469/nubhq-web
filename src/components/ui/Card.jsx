import { useTheme } from '../../contexts/ThemeContext';

const Card = ({
  children,
  className = '',
  padding = true,
  ...props
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div
      className={`border-3 border-black shadow-brutal transition-colors ${
        isLight ? 'bg-white' : 'bg-white/5'
      } ${padding ? 'p-4' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '' }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <h3 className={`text-lg font-bold ${isLight ? 'text-gray-900' : 'text-white'} ${className}`}>
      {children}
    </h3>
  );
};

const CardContent = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Content = CardContent;

export default Card;

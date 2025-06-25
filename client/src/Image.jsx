export default function Image({src,...rest}) {
  src = src && src.includes('https://')
    ? src
    : `${import.meta.env.VITE_API_BASE_URL || 'https://campusnest-gnjl.onrender.com'}/uploads/${src}`;
  return (
    <img {...rest} src={src} alt={''} />
  );
}
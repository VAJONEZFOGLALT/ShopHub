# Translation System Documentation

## Overview

This project uses a hybrid translation system:

1. **Static UI Translations**: Handled by `i18next` with JSON locale files (HU, EN, ES)
2. **Dynamic Content Translations**: Handled by LibreTranslate API for database content

## Static UI Translations (i18next)

Located in: `frontend/src/i18n/locales/`

Files:
- `hu.json` - Hungarian translations
- `en.json` - English translations
- `es.json` - Spanish translations

Usage in components:
```typescript
import { useTranslation } from 'react-i18next';

export default function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t('section.key')}</h1>;
}
```

Language switching is handled by the `LanguageSwitcher` component in the header.

## Dynamic Content Translations (LibreTranslate)

For content from the database (product names, descriptions, reviews, etc.), use the `useTranslateDynamic` hook.

### Backend API Endpoints

#### POST `/api/translations/translate`
Translates a single text string.

Request:
```json
{
  "text": "Product Name",
  "sourceLang": "en",
  "targetLang": "hu"
}
```

Response:
```json
{
  "translatedText": "Termék Név"
}
```

#### POST `/api/translations/translate-batch`
Translates multiple text strings in one request (more efficient).

Request:
```json
{
  "texts": ["Product 1", "Product 2", "Product 3"],
  "sourceLang": "en",
  "targetLang": "es"
}
```

Response:
```json
["Producto 1", "Producto 2", "Producto 3"]
```

### Frontend Hook

Use the `useTranslateDynamic` hook in components:

```typescript
import { useTranslateDynamic } from '@/hooks/useTranslateDynamic';

export default function ProductCard({ product }) {
  const { translate, translateBatch, isLoading, error } = useTranslateDynamic();
  const [translatedName, setTranslatedName] = useState(product.name);

  useEffect(() => {
    const fetchTranslation = async () => {
      const translated = await translate(product.name);
      setTranslatedName(translated);
    };
    fetchTranslation();
  }, [product.name, translate]);

  return (
    <div>
      <h2>{translatedName}</h2>
      {isLoading && <p>Translating...</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}
```

### Features

- **Automatic Caching**: Translations are cached in memory to avoid redundant API calls
- **Batch Translation**: More efficient than translating one-by-one
- **Error Handling**: Falls back to original text if translation fails
- **Fallback Language**: Defaults to current i18n language, falls back to English source

### Configuration

Environment variables (backend `.env`):

```env
# Optional - uses free API by default
LIBRETRANSLATE_API_URL="https://api.libretranslate.de"
LIBRETRANSLATE_API_KEY=""
```

## Supported Languages

- `hu` - Hungarian
- `en` - English
- `es` - Spanish

## Example: Translating Product Data

```typescript
import { useEffect, useState } from 'react';
import { useTranslateDynamic } from '@/hooks/useTranslateDynamic';

export function ProductsList({ products }) {
  const { translateBatch } = useTranslateDynamic();
  const [translatedProducts, setTranslatedProducts] = useState(products);

  useEffect(() => {
    const translateAll = async () => {
      const names = products.map(p => p.name);
      const translated = await translateBatch(names);
      
      setTranslatedProducts(
        products.map((p, idx) => ({
          ...p,
          name: translated[idx],
        }))
      );
    };

    translateAll();
  }, [products, translateBatch]);

  return (
    <div>
      {translatedProducts.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
        </div>
      ))}
    </div>
  );
}
```

## Best Practices

1. **Use Batch Translation**: When translating multiple items, use `translateBatch` instead of multiple `translate` calls
2. **Cache Results**: The hook automatically caches, but consider storing translations in state/Redux for frequently accessed content
3. **Handle Loading States**: Always show loading indicators during translation
4. **Fallback UI**: Design UI to handle untranslated content gracefully
5. **Static vs Dynamic**: Use i18next for UI strings, LibreTranslate for database content only

## Troubleshooting

### Translations not appearing
- Check browser console for errors
- Verify language code is correct (hu, en, es)
- Ensure LibreTranslate API is accessible

### Slow translations
- Use batch translation endpoint instead of individual calls
- Consider pre-translating data on initial page load
- Check network speed and API latency

### LibreTranslate API down
- Application falls back to English text automatically
- Consider adding fallback language support
- For production, consider hosting private LibreTranslate instance

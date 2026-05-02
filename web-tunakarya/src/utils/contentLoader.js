/**
 * Parse YAML frontmatter dari markdown file.
 * Mendukung: string, number, boolean, dan nested list (members, dll).
 */
const parseMarkdownFile = (content) => {
  // Normalisasi line endings
  const normalized = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const frontmatterRegex = /^---\n([\s\S]*?)\n---(\n|$)([\s\S]*)$/;
  const match = normalized.match(frontmatterRegex);

  if (!match) {
    return { data: {}, body: normalized.trim() };
  }

  const [, frontmatterStr, , body] = match;
  const data = parseYamlBlock(frontmatterStr);

  return { data, body: body.trim() };
};

/**
 * Parse blok YAML sederhana menjadi object JS.
 * Mendukung scalar, quoted string, dan list of objects (indented).
 */
const parseYamlBlock = (yamlStr) => {
  const data = {};
  const lines = yamlStr.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip baris kosong
    if (!line.trim()) { i++; continue; }

    // Deteksi key: value di level root (tidak ada indentasi)
    const rootKeyMatch = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*):\s*(.*)/);
    if (!rootKeyMatch) { i++; continue; }

    const key = rootKeyMatch[1];
    const inlineValue = rootKeyMatch[2].trim();

    // Cek apakah ini list (baris berikutnya dimulai dengan "  -")
    const nextLine = lines[i + 1] || '';
    if (inlineValue === '' && nextLine.match(/^\s+-\s/)) {
      // Parse list of objects
      const listItems = [];
      i++;
      while (i < lines.length) {
        const itemLine = lines[i];
        if (!itemLine.trim()) { i++; continue; }

        // Baris list item dimulai dengan "  - " (2+ spasi lalu dash)
        const listItemMatch = itemLine.match(/^(\s+)-\s+(.*)/);
        if (!listItemMatch) break; // Kembali ke level root

        const baseIndent = listItemMatch[1].length;
        const firstProp = listItemMatch[2].trim();
        const item = {};

        // Parse properti pertama di baris yang sama dengan "-"
        if (firstProp) {
          const propMatch = firstProp.match(/^([a-zA-Z_][a-zA-Z0-9_]*):\s*(.*)/);
          if (propMatch) {
            item[propMatch[1]] = parseScalar(propMatch[2].trim());
          }
        }

        i++;

        // Parse properti lanjutan di baris berikutnya (indentasi lebih dalam)
        while (i < lines.length) {
          const propLine = lines[i];
          if (!propLine.trim()) { i++; continue; }

          // Properti lanjutan harus lebih dalam dari "  -"
          const propMatch = propLine.match(/^(\s+)([a-zA-Z_][a-zA-Z0-9_]*):\s*(.*)/);
          if (!propMatch || propMatch[1].length <= baseIndent) break;

          item[propMatch[2]] = parseScalar(propMatch[3].trim());
          i++;
        }

        if (Object.keys(item).length > 0) {
          listItems.push(item);
        }
      }
      data[key] = listItems;
    } else {
      // Scalar value
      data[key] = parseScalar(inlineValue);
      i++;
    }
  }

  return data;
};

/**
 * Konversi string YAML scalar ke tipe JS yang sesuai.
 */
const parseScalar = (value) => {
  if (value === '' || value === null || value === undefined) return '';

  // Hapus quotes
  const unquoted = value.replace(/^["']|["']$/g, '');

  if (unquoted === 'true') return true;
  if (unquoted === 'false') return false;
  if (unquoted !== '' && !isNaN(unquoted)) return Number(unquoted);

  return unquoted;
};

/**
 * Fetch semua item dari sebuah collection.
 * Membaca manifest.json lalu fetch tiap file markdown.
 */
export const fetchContent = async (collection, activeOnly = true) => {
  try {
    const manifestResponse = await fetch(`/content/${collection}/manifest.json`);

    if (!manifestResponse.ok) {
      console.warn(`Manifest not found for collection: ${collection}`);
      return [];
    }

    const manifest = await manifestResponse.json();
    const files = manifest.files || [];

    const items = [];

    for (const file of files) {
      const response = await fetch(`/content/${collection}/${file}`);
      if (!response.ok) continue;

      const content = await response.text();
      const { data, body } = parseMarkdownFile(content);

      if (activeOnly && data.active === false) {
        continue;
      }

      items.push({
        ...data,
        body,
        slug: file.replace('.md', ''),
      });
    }

    items.sort((a, b) => (a.order || 0) - (b.order || 0));

    return items;
  } catch (error) {
    console.error(`Error fetching ${collection}:`, error);
    return [];
  }
};

/**
 * Fetch global site settings dari site.json.
 */
export const fetchSettings = async () => {
  try {
    const response = await fetch('/content/settings/site.json');
    if (!response.ok) return {};
    return await response.json();
  } catch (error) {
    console.error('Error fetching settings:', error);
    return {};
  }
};

/**
 * Fetch navigation menu dari navigation.json.
 */
export const fetchNavigation = async () => {
  try {
    const response = await fetch('/content/settings/navigation.json');
    if (!response.ok) return [];
    const data = await response.json();
    return data.menu_items || [];
  } catch (error) {
    console.error('Error fetching navigation:', error);
    return [];
  }
};

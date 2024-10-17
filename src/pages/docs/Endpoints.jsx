import React from 'react';
import CodeBlock from './CodeBlock';

export default function Endpoints() {
  const productPutCode = `
app.put('/products/:id', authenticateToken, (req, res) => {
  const productId = req.params.id.toString(); 
  const index = req.sessionData.products.findIndex(p => p.id === productId);

  if (index === -1) {
      return res.status(404).send('Product not found');
  }

  const existingProduct = req.sessionData.products[index]; 

  try {
      const updatedProductData = { ...existingProduct, ...req.body };

      const { valid, errors } = sanitizeAndValidateProduct(updatedProductData, existingProduct);
      if (!valid) {
          return res.status(400).json({ errors });
      }

      const updatedProduct = { ...existingProduct, ...updatedProductData };

      req.sessionData.products[index] = updatedProduct;
      res.json(updatedProduct);
  } catch (err) {
      console.error('Error while updating the product:', err.message);
      res.status(500).json({ message: err.message });
  }
});
  `;

  const userPutCode = `
app.put('/users/:id', authenticateToken, (req, res) => {
  const index = req.sessionData.users.findIndex(u => u.id == req.params.id);
  if (index === -1) {
    return res.status(404).send('User not found');
  }

  const existingUser = req.sessionData.users[index]; 
  
  if (req.body.status === 'usunięty') {
    req.sessionData.users[index] = { ...existingUser, status: 'usunięty' };
    return res.json(req.sessionData.users[index]);
  }

  const { valid, errors } = sanitizeAndValidateUser(req.body);
  if (!valid) {
    return res.status(400).json({ errors });
  }

  req.sessionData.users[index] = { ...existingUser, ...req.body };
  res.json(req.sessionData.users[index]);
});
  `;

  return (
    <div className="endpoints">
      <p>W aplikacji wykorzystano kilka endpointów do zarządzania <strong>produktami</strong> oraz <strong>pracownikami</strong>. Poniżej opisano ich działanie oraz sposób, w jaki zarządzane są usunięcia elementów. W przypadku tej aplikacji, zamiast trwale usuwać produkty lub pracowników, są one oznaczane jako usunięte i przenoszone do osobnych widoków "Lista usuniętych".</p>

      <h3>Endpointy dla produktów:</h3>
      <ul>
        <li><strong>GET /products</strong> - Zwraca listę wszystkich produktów z aplikacji.</li>
        <li><strong>GET /products/:id</strong> - Zwraca szczegóły produktu o podanym ID.</li>
        <li><strong>POST /products</strong> - Tworzy nowy produkt na podstawie przesłanych danych.</li>
        <li><strong>PUT /products/:id</strong> - Aktualizuje dane istniejącego produktu. Ten endpoint wykorzystywany jest również do oznaczania produktów jako usuniętych (zamiast faktycznego usuwania).</li>
        <li><strong>DELETE /products/:id</strong> - Endpoint do usuwania produktów, obecnie nieużywany. Produkty są oznaczane jako usunięte przy użyciu endpointu PUT.</li>
        <li><strong>POST /upload</strong> - Endpoint umożliwiający przesyłanie obrazów dla produktów lub pracowników. Obrazy są przechowywane w odpowiednich katalogach, a użytkownik otrzymuje ścieżkę do przesłanego pliku.</li>
      </ul>

      <h3>Przykładowy kod dla PUT /products/:id:</h3>
      <CodeBlock code={productPutCode} />

      <h3>Endpointy dla pracowników:</h3>
      <ul>
        <li><strong>GET /users</strong> - Zwraca listę wszystkich pracowników.</li>
        <li><strong>GET /users/:id</strong> - Zwraca szczegóły pracownika o podanym ID.</li>
        <li><strong>POST /users</strong> - Tworzy nowego pracownika na podstawie przesłanych danych.</li>
        <li><strong>PUT /users/:id</strong> - Aktualizuje dane istniejącego pracownika. Ten endpoint wykorzystywany jest również do oznaczania pracowników jako usuniętych (zamiast faktycznego usuwania).</li>
        <li><strong>DELETE /users/:id</strong> - Endpoint do usuwania pracowników, obecnie nieużywany. Pracownicy są oznaczani jako usunięci przy użyciu endpointu PUT.</li>
      </ul>

      <h3>Przykładowy kod dla PUT /users/:id:</h3>
      <CodeBlock code={userPutCode} />

      <h3>Zalety oznaczania jako "usunięte" zamiast trwałego usuwania:</h3>
      <p>W aplikacji zamiast trwałego usuwania produktów i pracowników, używamy mechanizmu oznaczania jako "usunięte". Takie podejście przynosi kilka korzyści:</p>
      <ul>
        <li><strong>Bezpieczeństwo danych:</strong> Oznaczanie elementów jako usunięte pozwala na łatwe przywracanie danych, minimalizując ryzyko przypadkowej utraty ważnych informacji.</li>
        <li><strong>Śledzenie historii:</strong> Umożliwia śledzenie, które produkty lub pracownicy zostali usunięci, co może być przydatne w przyszłych analizach.</li>
        <li><strong>Lepsza kontrola nad danymi:</strong> Elementy oznaczone jako usunięte nie są wyświetlane na głównych listach, ale są przechowywane w systemie, co pozwala na późniejsze przywrócenie ich widoczności.</li>
      </ul>

      <p>Takie podejście idealnie pasuje do nauki automatyzacji testów, ponieważ umożliwia testowanie różnych scenariuszy bez ryzyka faktycznego usunięcia danych, co pozwala na eksperymentowanie z różnymi akcjami i testami frontendu przy użyciu WebdriverIO.</p>
    </div>
  );
}

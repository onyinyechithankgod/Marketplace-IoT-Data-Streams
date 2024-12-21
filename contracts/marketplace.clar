;; Marketplace Contract

(define-map token-metadata
  { token-id: uint }
  {
    owner: principal,
    price-per-access: uint
  }
)

(define-map data-access
  { token-id: uint, user: principal }
  { expiration: uint }
)

(define-public (register-data-token (token-id uint) (price-per-access uint))
  (let
    (
      (caller tx-sender)
    )
    (map-set token-metadata
      { token-id: token-id }
      {
        owner: caller,
        price-per-access: price-per-access
      }
    )
    (ok true)
  )
)

(define-public (purchase-access (token-id uint) (duration uint))
  (let
    (
      (metadata (unwrap! (map-get? token-metadata { token-id: token-id }) (err u404)))
      (owner (get owner metadata))
      (price-per-access (get price-per-access metadata))
      (total-price (* price-per-access duration))
      (current-time block-height)
    )
    (try! (stx-transfer? total-price tx-sender owner))
    (map-set data-access
      { token-id: token-id, user: tx-sender }
      { expiration: (+ current-time duration) }
    )
    (ok true)
  )
)

(define-read-only (check-access (token-id uint) (user principal))
  (let
    (
      (access-info (default-to { expiration: u0 } (map-get? data-access { token-id: token-id, user: user })))
    )
    (ok (> (get expiration access-info) block-height))
  )
)

(define-public (provide-data (token-id uint) (data (string-ascii 500)))
  (let
    (
      (metadata (unwrap! (map-get? token-metadata { token-id: token-id }) (err u404)))
      (owner (get owner metadata))
    )
    (asserts! (is-eq tx-sender owner) (err u403))
    ;; In a real implementation, we would store or transmit the data securely
    ;; For this example, we'll just return OK
    (ok true)
  )
)


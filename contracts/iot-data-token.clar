;; IoT Data Token Contract

(define-non-fungible-token iot-data-token uint)

(define-data-var token-id-nonce uint u0)

(define-map token-metadata
  { token-id: uint }
  {
    owner: principal,
    device-id: (string-ascii 50),
    data-type: (string-ascii 50),
    update-frequency: uint,
    price-per-access: uint
  }
)

(define-public (mint-data-token (device-id (string-ascii 50)) (data-type (string-ascii 50)) (update-frequency uint) (price-per-access uint))
  (let
    (
      (token-id (var-get token-id-nonce))
      (caller tx-sender)
    )
    (try! (nft-mint? iot-data-token token-id caller))
    (map-set token-metadata
      { token-id: token-id }
      {
        owner: caller,
        device-id: device-id,
        data-type: data-type,
        update-frequency: update-frequency,
        price-per-access: price-per-access
      }
    )
    (var-set token-id-nonce (+ token-id u1))
    (ok token-id)
  )
)

(define-read-only (get-token-metadata (token-id uint))
  (map-get? token-metadata { token-id: token-id })
)

(define-public (update-price (token-id uint) (new-price uint))
  (let
    (
      (token-owner (unwrap! (nft-get-owner? iot-data-token token-id) (err u404)))
    )
    (asserts! (is-eq tx-sender token-owner) (err u403))
    (map-set token-metadata
      { token-id: token-id }
      (merge (unwrap! (map-get? token-metadata { token-id: token-id }) (err u404))
             { price-per-access: new-price })
    )
    (ok true)
  )
)

(define-public (transfer (token-id uint) (recipient principal))
  (let
    (
      (owner (unwrap! (nft-get-owner? iot-data-token token-id) (err u404)))
    )
    (asserts! (is-eq tx-sender owner) (err u403))
    (try! (nft-transfer? iot-data-token token-id tx-sender recipient))
    (ok true)
  )
)


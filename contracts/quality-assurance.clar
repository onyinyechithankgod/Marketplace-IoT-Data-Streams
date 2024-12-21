;; Quality Assurance Contract

(define-map data-ratings
  { token-id: uint }
  { total-rating: uint, rating-count: uint }
)

(define-public (rate-data (token-id uint) (rating uint))
  (let
    (
      (current-rating (default-to { total-rating: u0, rating-count: u0 } (map-get? data-ratings { token-id: token-id })))
      (new-total (+ (get total-rating current-rating) rating))
      (new-count (+ (get rating-count current-rating) u1))
    )
    (asserts! (and (>= rating u1) (<= rating u5)) (err u400))
    (asserts! (is-some (contract-call? .iot-data-token get-token-metadata token-id)) (err u404))
    (map-set data-ratings
      { token-id: token-id }
      { total-rating: new-total, rating-count: new-count }
    )
    (ok true)
  )
)

(define-read-only (get-average-rating (token-id uint))
  (let
    (
      (rating-info (default-to { total-rating: u0, rating-count: u0 } (map-get? data-ratings { token-id: token-id })))
      (total-rating (get total-rating rating-info))
      (rating-count (get rating-count rating-info))
    )
    (if (is-eq rating-count u0)
      (ok u0)
      (ok (/ total-rating rating-count))
    )
  )
)


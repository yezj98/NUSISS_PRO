package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.ProductListing;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ProductListing entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductListingRepository extends JpaRepository<ProductListing, Long> {}

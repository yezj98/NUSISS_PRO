package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.ProductListing;
import com.mycompany.myapp.repository.ProductListingRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.ProductListing}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ProductListingResource {

    private final Logger log = LoggerFactory.getLogger(ProductListingResource.class);

    private static final String ENTITY_NAME = "productListing";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProductListingRepository productListingRepository;

    public ProductListingResource(ProductListingRepository productListingRepository) {
        this.productListingRepository = productListingRepository;
    }

    /**
     * {@code POST  /product-listings} : Create a new productListing.
     *
     * @param productListing the productListing to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new productListing, or with status {@code 400 (Bad Request)} if the productListing has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/product-listings")
    public ResponseEntity<ProductListing> createProductListing(@RequestBody ProductListing productListing) throws URISyntaxException {
        log.debug("REST request to save ProductListing : {}", productListing);
        if (productListing.getId() != null) {
            throw new BadRequestAlertException("A new productListing cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ProductListing result = productListingRepository.save(productListing);
        return ResponseEntity
            .created(new URI("/api/product-listings/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /product-listings/:id} : Updates an existing productListing.
     *
     * @param id the id of the productListing to save.
     * @param productListing the productListing to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated productListing,
     * or with status {@code 400 (Bad Request)} if the productListing is not valid,
     * or with status {@code 500 (Internal Server Error)} if the productListing couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/product-listings/{id}")
    public ResponseEntity<ProductListing> updateProductListing(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ProductListing productListing
    ) throws URISyntaxException {
        log.debug("REST request to update ProductListing : {}, {}", id, productListing);
        if (productListing.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, productListing.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!productListingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ProductListing result = productListingRepository.save(productListing);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, productListing.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /product-listings/:id} : Partial updates given fields of an existing productListing, field will ignore if it is null
     *
     * @param id the id of the productListing to save.
     * @param productListing the productListing to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated productListing,
     * or with status {@code 400 (Bad Request)} if the productListing is not valid,
     * or with status {@code 404 (Not Found)} if the productListing is not found,
     * or with status {@code 500 (Internal Server Error)} if the productListing couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/product-listings/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ProductListing> partialUpdateProductListing(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ProductListing productListing
    ) throws URISyntaxException {
        log.debug("REST request to partial update ProductListing partially : {}, {}", id, productListing);
        if (productListing.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, productListing.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!productListingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ProductListing> result = productListingRepository
            .findById(productListing.getId())
            .map(existingProductListing -> {
                if (productListing.getProductName() != null) {
                    existingProductListing.setProductName(productListing.getProductName());
                }
                if (productListing.getQuantity() != null) {
                    existingProductListing.setQuantity(productListing.getQuantity());
                }
                if (productListing.getPrice() != null) {
                    existingProductListing.setPrice(productListing.getPrice());
                }

                return existingProductListing;
            })
            .map(productListingRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, productListing.getId().toString())
        );
    }

    /**
     * {@code GET  /product-listings} : get all the productListings.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of productListings in body.
     */
    @GetMapping("/product-listings")
    public ResponseEntity<List<ProductListing>> getAllProductListings(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of ProductListings");
        Page<ProductListing> page = productListingRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /product-listings/:id} : get the "id" productListing.
     *
     * @param id the id of the productListing to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the productListing, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/product-listings/{id}")
    public ResponseEntity<ProductListing> getProductListing(@PathVariable Long id) {
        log.debug("REST request to get ProductListing : {}", id);
        Optional<ProductListing> productListing = productListingRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(productListing);
    }

    /**
     * {@code DELETE  /product-listings/:id} : delete the "id" productListing.
     *
     * @param id the id of the productListing to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/product-listings/{id}")
    public ResponseEntity<Void> deleteProductListing(@PathVariable Long id) {
        log.debug("REST request to delete ProductListing : {}", id);
        productListingRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}

package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.ProductListing;
import com.mycompany.myapp.repository.ProductListingRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ProductListingResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ProductListingResourceIT {

    private static final String DEFAULT_PRODUCT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_PRODUCT_NAME = "BBBBBBBBBB";

    private static final Integer DEFAULT_QUANTITY = 1;
    private static final Integer UPDATED_QUANTITY = 2;

    private static final Double DEFAULT_PRICE = 1D;
    private static final Double UPDATED_PRICE = 2D;

    private static final String ENTITY_API_URL = "/api/product-listings";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ProductListingRepository productListingRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProductListingMockMvc;

    private ProductListing productListing;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductListing createEntity(EntityManager em) {
        ProductListing productListing = new ProductListing()
            .productName(DEFAULT_PRODUCT_NAME)
            .quantity(DEFAULT_QUANTITY)
            .price(DEFAULT_PRICE);
        return productListing;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductListing createUpdatedEntity(EntityManager em) {
        ProductListing productListing = new ProductListing()
            .productName(UPDATED_PRODUCT_NAME)
            .quantity(UPDATED_QUANTITY)
            .price(UPDATED_PRICE);
        return productListing;
    }

    @BeforeEach
    public void initTest() {
        productListing = createEntity(em);
    }

    @Test
    @Transactional
    void createProductListing() throws Exception {
        int databaseSizeBeforeCreate = productListingRepository.findAll().size();
        // Create the ProductListing
        restProductListingMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(productListing))
            )
            .andExpect(status().isCreated());

        // Validate the ProductListing in the database
        List<ProductListing> productListingList = productListingRepository.findAll();
        assertThat(productListingList).hasSize(databaseSizeBeforeCreate + 1);
        ProductListing testProductListing = productListingList.get(productListingList.size() - 1);
        assertThat(testProductListing.getProductName()).isEqualTo(DEFAULT_PRODUCT_NAME);
        assertThat(testProductListing.getQuantity()).isEqualTo(DEFAULT_QUANTITY);
        assertThat(testProductListing.getPrice()).isEqualTo(DEFAULT_PRICE);
    }

    @Test
    @Transactional
    void createProductListingWithExistingId() throws Exception {
        // Create the ProductListing with an existing ID
        productListing.setId(1L);

        int databaseSizeBeforeCreate = productListingRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProductListingMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(productListing))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductListing in the database
        List<ProductListing> productListingList = productListingRepository.findAll();
        assertThat(productListingList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllProductListings() throws Exception {
        // Initialize the database
        productListingRepository.saveAndFlush(productListing);

        // Get all the productListingList
        restProductListingMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productListing.getId().intValue())))
            .andExpect(jsonPath("$.[*].productName").value(hasItem(DEFAULT_PRODUCT_NAME)))
            .andExpect(jsonPath("$.[*].quantity").value(hasItem(DEFAULT_QUANTITY)))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.doubleValue())));
    }

    @Test
    @Transactional
    void getProductListing() throws Exception {
        // Initialize the database
        productListingRepository.saveAndFlush(productListing);

        // Get the productListing
        restProductListingMockMvc
            .perform(get(ENTITY_API_URL_ID, productListing.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(productListing.getId().intValue()))
            .andExpect(jsonPath("$.productName").value(DEFAULT_PRODUCT_NAME))
            .andExpect(jsonPath("$.quantity").value(DEFAULT_QUANTITY))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingProductListing() throws Exception {
        // Get the productListing
        restProductListingMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingProductListing() throws Exception {
        // Initialize the database
        productListingRepository.saveAndFlush(productListing);

        int databaseSizeBeforeUpdate = productListingRepository.findAll().size();

        // Update the productListing
        ProductListing updatedProductListing = productListingRepository.findById(productListing.getId()).get();
        // Disconnect from session so that the updates on updatedProductListing are not directly saved in db
        em.detach(updatedProductListing);
        updatedProductListing.productName(UPDATED_PRODUCT_NAME).quantity(UPDATED_QUANTITY).price(UPDATED_PRICE);

        restProductListingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedProductListing.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedProductListing))
            )
            .andExpect(status().isOk());

        // Validate the ProductListing in the database
        List<ProductListing> productListingList = productListingRepository.findAll();
        assertThat(productListingList).hasSize(databaseSizeBeforeUpdate);
        ProductListing testProductListing = productListingList.get(productListingList.size() - 1);
        assertThat(testProductListing.getProductName()).isEqualTo(UPDATED_PRODUCT_NAME);
        assertThat(testProductListing.getQuantity()).isEqualTo(UPDATED_QUANTITY);
        assertThat(testProductListing.getPrice()).isEqualTo(UPDATED_PRICE);
    }

    @Test
    @Transactional
    void putNonExistingProductListing() throws Exception {
        int databaseSizeBeforeUpdate = productListingRepository.findAll().size();
        productListing.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductListingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, productListing.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(productListing))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductListing in the database
        List<ProductListing> productListingList = productListingRepository.findAll();
        assertThat(productListingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProductListing() throws Exception {
        int databaseSizeBeforeUpdate = productListingRepository.findAll().size();
        productListing.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductListingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(productListing))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductListing in the database
        List<ProductListing> productListingList = productListingRepository.findAll();
        assertThat(productListingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProductListing() throws Exception {
        int databaseSizeBeforeUpdate = productListingRepository.findAll().size();
        productListing.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductListingMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(productListing)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProductListing in the database
        List<ProductListing> productListingList = productListingRepository.findAll();
        assertThat(productListingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProductListingWithPatch() throws Exception {
        // Initialize the database
        productListingRepository.saveAndFlush(productListing);

        int databaseSizeBeforeUpdate = productListingRepository.findAll().size();

        // Update the productListing using partial update
        ProductListing partialUpdatedProductListing = new ProductListing();
        partialUpdatedProductListing.setId(productListing.getId());

        restProductListingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProductListing.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProductListing))
            )
            .andExpect(status().isOk());

        // Validate the ProductListing in the database
        List<ProductListing> productListingList = productListingRepository.findAll();
        assertThat(productListingList).hasSize(databaseSizeBeforeUpdate);
        ProductListing testProductListing = productListingList.get(productListingList.size() - 1);
        assertThat(testProductListing.getProductName()).isEqualTo(DEFAULT_PRODUCT_NAME);
        assertThat(testProductListing.getQuantity()).isEqualTo(DEFAULT_QUANTITY);
        assertThat(testProductListing.getPrice()).isEqualTo(DEFAULT_PRICE);
    }

    @Test
    @Transactional
    void fullUpdateProductListingWithPatch() throws Exception {
        // Initialize the database
        productListingRepository.saveAndFlush(productListing);

        int databaseSizeBeforeUpdate = productListingRepository.findAll().size();

        // Update the productListing using partial update
        ProductListing partialUpdatedProductListing = new ProductListing();
        partialUpdatedProductListing.setId(productListing.getId());

        partialUpdatedProductListing.productName(UPDATED_PRODUCT_NAME).quantity(UPDATED_QUANTITY).price(UPDATED_PRICE);

        restProductListingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProductListing.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProductListing))
            )
            .andExpect(status().isOk());

        // Validate the ProductListing in the database
        List<ProductListing> productListingList = productListingRepository.findAll();
        assertThat(productListingList).hasSize(databaseSizeBeforeUpdate);
        ProductListing testProductListing = productListingList.get(productListingList.size() - 1);
        assertThat(testProductListing.getProductName()).isEqualTo(UPDATED_PRODUCT_NAME);
        assertThat(testProductListing.getQuantity()).isEqualTo(UPDATED_QUANTITY);
        assertThat(testProductListing.getPrice()).isEqualTo(UPDATED_PRICE);
    }

    @Test
    @Transactional
    void patchNonExistingProductListing() throws Exception {
        int databaseSizeBeforeUpdate = productListingRepository.findAll().size();
        productListing.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductListingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, productListing.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(productListing))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductListing in the database
        List<ProductListing> productListingList = productListingRepository.findAll();
        assertThat(productListingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProductListing() throws Exception {
        int databaseSizeBeforeUpdate = productListingRepository.findAll().size();
        productListing.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductListingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(productListing))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductListing in the database
        List<ProductListing> productListingList = productListingRepository.findAll();
        assertThat(productListingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProductListing() throws Exception {
        int databaseSizeBeforeUpdate = productListingRepository.findAll().size();
        productListing.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductListingMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(productListing))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProductListing in the database
        List<ProductListing> productListingList = productListingRepository.findAll();
        assertThat(productListingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProductListing() throws Exception {
        // Initialize the database
        productListingRepository.saveAndFlush(productListing);

        int databaseSizeBeforeDelete = productListingRepository.findAll().size();

        // Delete the productListing
        restProductListingMockMvc
            .perform(delete(ENTITY_API_URL_ID, productListing.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ProductListing> productListingList = productListingRepository.findAll();
        assertThat(productListingList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

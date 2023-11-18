package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProductListingTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProductListing.class);
        ProductListing productListing1 = new ProductListing();
        productListing1.setId(1L);
        ProductListing productListing2 = new ProductListing();
        productListing2.setId(productListing1.getId());
        assertThat(productListing1).isEqualTo(productListing2);
        productListing2.setId(2L);
        assertThat(productListing1).isNotEqualTo(productListing2);
        productListing1.setId(null);
        assertThat(productListing1).isNotEqualTo(productListing2);
    }
}

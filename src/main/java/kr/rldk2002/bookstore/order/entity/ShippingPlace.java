package kr.rldk2002.bookstore.order.entity;

import kr.rldk2002.bookstore.order.validation.OrderGroupMarker.*;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

@Getter
@Setter
public class ShippingPlace {
    @Size(max = 8, groups = { AddShippingPlace.class })
    private String no;

    @NotBlank(groups = { AddShippingPlace.class })
    @Size(max = 10, groups = { AddShippingPlace.class })
    private String placeName;

    @NotBlank(groups = { AddShippingPlace.class })
    @Size(max = 30, groups = { AddShippingPlace.class })
    private String receiver;

    @NotBlank(groups = { AddShippingPlace.class })
    @Size(max = 20, groups = { AddShippingPlace.class })
    @Pattern(regexp = "^[0-9]+$", groups = { AddShippingPlace.class })
    private String phone;

    @NotBlank(groups = { AddShippingPlace.class })
    @Size(max = 6, groups = { AddShippingPlace.class })
    private String zipCode;

    @NotBlank(groups = { AddShippingPlace.class })
    @Size(max = 100, groups = { AddShippingPlace.class })
    private String roadAddress;

    @Size(max = 100, groups = { AddShippingPlace.class })
    private String additionalAddress;
    private boolean basic;

    private String memberNo;
}

package kr.rldk2002.bookstore.order;

import kr.rldk2002.bookstore.order.entity.ShippingPlace;
import kr.rldk2002.bookstore.order.service.ShippingService;
import kr.rldk2002.bookstore.order.validation.OrderGroupMarker;
import kr.rldk2002.bookstore.support.ResponseResult;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.util.StringUtils;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/shipping")
@RequiredArgsConstructor
public class ShippingController {
    private final ShippingService shippingService;

    @PostMapping("/place")
    public ResponseResult shippingPlaceSave(
            @Validated(OrderGroupMarker.AddShippingPlace.class) @ModelAttribute ShippingPlace shippingPlace,
            BindingResult bindingResult,
            @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : no") String memberNo
    ) throws BindException {

        if (bindingResult.hasErrors()) {
            throw new BindException(bindingResult);
        }

        if (!StringUtils.hasText(shippingPlace.getNo())) {
            shippingPlace.setNo(RandomStringUtils.randomAlphanumeric(8));
        }
        shippingService.addShippingPlace(memberNo, shippingPlace);

        return new ResponseResult("200", "배송지 저장 성공", true);
    }

    @GetMapping("/place")
    public List<ShippingPlace> shippingPlaceList(
            @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : no") String memberNo
    ) {
        return shippingService.getShippingPlaceList(memberNo);
    }

    @GetMapping(value = "/place", params = { "no" })
    public ShippingPlace shippingPlaceOne(
            @RequestParam("no") String shippingPlaceNo,
            @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : no") String memberNo
    ) {
        return shippingService.getShippingPlace(memberNo, shippingPlaceNo);
    }

    @DeleteMapping("/place")
    public ResponseResult shippingPlaceRemove(
            @RequestParam("no") String shippingPlaceNo,
            @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : no") String memberNo
    ) {
        shippingService.removeShippingPlace(memberNo, shippingPlaceNo);
        return new ResponseResult("200", "배송지 삭제 성공", true);
    }

    @GetMapping("/place/basic")
    public String shippingPlaceBasic(
            @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : no") String memberNo
    ) {
        return shippingService.getShippingPlaceBasic(memberNo);
    }

}

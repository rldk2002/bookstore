package kr.rldk2002.bookstore.order.service;

import kr.rldk2002.bookstore.order.entity.ShippingPlace;
import kr.rldk2002.bookstore.order.mapper.ShippingMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ShippingService {
    private final ShippingMapper shippingMapper;

    @PreAuthorize("isAuthenticated() and (#memberNo == principal.no)")
    public void addShippingPlace(String memberNo, ShippingPlace shippingPlace) {
        String shippingPlaceBasicNo = shippingMapper.selectShippingPlaceBasic(memberNo);

        if (shippingMapper.selectShippingPlace(shippingPlace.getNo()) == null) {
            // 새로운 배송지를 등록하는 경우
            shippingMapper.insertShippingPlace(memberNo, shippingPlace);

            if (shippingPlaceBasicNo == null) {
                // 등록된 기본 배송지가 없는 경우
                shippingMapper.insertShippingPlaceBasic(memberNo, shippingPlace.getNo());
            } else {
                if (shippingPlace.isBasic()) {
                    // 기본 배송지로 설정
                    shippingMapper.updateShippingPlaceBasic(memberNo, shippingPlace.getNo());
                }
            }
        }
        else {
            // 이미 등록된 배송지인 경우(배송지 수정)
            shippingMapper.updateShippingPlace(memberNo, shippingPlace);
            if (shippingPlace.isBasic()) {
                // 기본배송지 변경
                shippingMapper.updateShippingPlaceBasic(memberNo, shippingPlace.getNo());
            } else {

            }
        }
    }

    @PreAuthorize("isAuthenticated() and (#memberNo == principal.no)")
    public List<ShippingPlace> getShippingPlaceList(String memberNo) {
        return shippingMapper.selectShippingPlaceList(memberNo);
    }

    @PreAuthorize("isAuthenticated() and (#memberNo == principal.no)")
    public ShippingPlace getShippingPlace(String memberNo, String shippingPlaceNo) {
        return shippingMapper.selectShippingPlace(shippingPlaceNo);
    }

    @PreAuthorize("isAuthenticated() and (#memberNo == principal.no)")
    public void removeShippingPlace(String memberNo, String shippingPlaceNo) {
        String basicNo = shippingMapper.selectShippingPlaceBasic(memberNo);

        shippingMapper.deleteShippingPlace(memberNo, shippingPlaceNo);
        if (basicNo.equals(shippingPlaceNo)) {
            List<ShippingPlace> placeList = shippingMapper.selectShippingPlaceList(memberNo);

            if (placeList.size() > 1) {
                shippingMapper.updateShippingPlaceBasic(memberNo, placeList.get(0).getNo());
            } else {
                shippingMapper.deleteShippingPlaceBasic(memberNo);
            }
        }
    }

    @PreAuthorize("isAuthenticated() and (#memberNo == principal.no)")
    public String getShippingPlaceBasic(String memberNo) {
        return shippingMapper.selectShippingPlaceBasic(memberNo);
    }

}

package kr.rldk2002.bookstore.order.mapper;

import kr.rldk2002.bookstore.order.entity.ShippingPlace;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ShippingMapper {
    void insertShippingPlace(@Param("memberNo") String memberNo, @Param("shippingPlace") ShippingPlace shippingPlace);
    ShippingPlace selectShippingPlace(@Param("shippingAddressNo") String shippingAddressNo);
    List<ShippingPlace> selectShippingPlaceList(@Param("memberNo") String memberNo);
    void updateShippingPlace(@Param("memberNo") String memberNo, @Param("shippingPlace") ShippingPlace shippingPlace);
    void deleteShippingPlace(@Param("memberNo") String memberNo, @Param("shippingAddressNo") String shippingPlaceNo);
    void insertShippingPlaceBasic(@Param("memberNo") String memberNo, @Param("shippingAddressNo") String shippingAddressNo);
    String selectShippingPlaceBasic(@Param("memberNo") String memberNo);
    void updateShippingPlaceBasic(@Param("memberNo") String memberNo, @Param("shippingAddressNo") String shippingAddressNo);
    void deleteShippingPlaceBasic(@Param("memberNo") String memberNo);
}
